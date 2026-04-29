// دریافت آدرس سرور مقصد و حذف اسلش‌های اضافی انتهای آدرس
const UPSTREAM_SERVER = (Netlify.env.get("TARGET_DOMAIN") || "").replace(/\/+$/, "");

// لیست هدرهایی که نباید به سرور مقصد ارسال شوند
const BANNED_HEADERS = [
  "host", "connection", "keep-alive", "proxy-authenticate", 
  "proxy-authorization", "te", "trailer", "transfer-encoding", 
  "upgrade", "forwarded", "x-forwarded-host", "x-forwarded-proto", 
  "x-forwarded-port"
];

// تابع بررسی مجاز بودن هدرها
const isHeaderAllowed = (headerName) => {
  const normalized = headerName.toLowerCase();
  return !(
    BANNED_HEADERS.includes(normalized) || 
    normalized.startsWith("x-nf-") || 
    normalized.startsWith("x-netlify-")
  );
};

export default async (req) => {
  // بررسی تنظیم بودن متغیر محیطی
  if (!UPSTREAM_SERVER) {
    return new Response("Server Error: TARGET_DOMAIN is missing", { status: 500 });
  }

  try {
    const parsedUrl = new URL(req.url);
    const destinationUrl = `${UPSTREAM_SERVER}${parsedUrl.pathname}${parsedUrl.search}`;

    const proxyHeaders = new Headers();
    let detectedUserIp = null;

    // پردازش و فیلتر کردن هدرهای دریافتی
    req.headers.forEach((val, key) => {
      const lowerKey = key.toLowerCase();
      
      if (!isHeaderAllowed(lowerKey)) return;

      if (lowerKey === "x-real-ip") {
        detectedUserIp = val;
      } else if (lowerKey === "x-forwarded-for") {
        if (!detectedUserIp) detectedUserIp = val;
      } else {
        proxyHeaders.append(key, val);
      }
    });

    // تنظیم آی‌پی واقعی کاربر در هدر
    if (detectedUserIp) {
      proxyHeaders.set("x-forwarded-for", detectedUserIp);
    }

    // بررسی اینکه آیا متد درخواست اجازه داشتن Body را دارد یا خیر
    const isBodyPermitted = !["GET", "HEAD"].includes(req.method);
    
    // آماده‌سازی تنظیمات درخواست برای ارسال به سرور اصلی
    const fetchConfig = {
      method: req.method,
      headers: proxyHeaders,
      redirect: "manual",
      ...(isBodyPermitted && { body: req.body }) // اضافه کردن بادی در صورت مجاز بودن
    };

    // ارسال درخواست به سرور مقصد
    const targetResponse = await fetch(destinationUrl, fetchConfig);

    // آماده‌سازی هدرهای پاسخ برای ارسال به کاربر
    const clientResponseHeaders = new Headers();
    targetResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "transfer-encoding") {
        clientResponseHeaders.set(key, value);
      }
    });

    // بازگرداندن پاسخ نهایی
    return new Response(targetResponse.body, {
      status: targetResponse.status,
      headers: clientResponseHeaders,
    });

  } catch (error) {
    // مدیریت خطای عدم ارتباط با سرور مقصد
    return new Response("502 Bad Gateway: Upstream connection failed", { status: 502 });
  }
};