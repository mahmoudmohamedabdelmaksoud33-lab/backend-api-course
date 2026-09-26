const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json"); //نوع المحتوى و قيمة الهيدر (البيانات اللي جايه بصيغة json )

  const url = req.url; // نوع الرابط
  const method = req.method; // نوع الطلب get or post

  if (url === "/" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Welcome to Home Route" }));
  } else if (url === "/users" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Users Route", users: [] }));
  } else if (url === "/products" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Products Route", products: [] }));
  } else if (url === "/add-user" && method === "POST") {
    let body = ""; // استخدام  let  بدل const نظرا لان المتغير هيتغير اكتر من مره

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedData = body ? JSON.parse(body) : {};

      res.statusCode = 201;
      res.end(
        JSON.stringify({
          message: "Data received and saved successfully!",
          dataReceived: parsedData,
        }),
      );
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Route Not Found" }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
