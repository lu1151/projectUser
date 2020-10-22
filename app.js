const http = require("http");
const url = require("url");
const querystring = require("querystring");
const template = require("art-template");

require("./model/index");
const User = require("./model/user");

// createServer
const app = http.createServer();

app.on("request", async (req, res) => {
  const method = req.method;
  const { pathname, query } = url.parse(req.url, true);

  if (method == "GET") {
    if (pathname == "/list") {
      // Get users's info form database
      let users = await User.find();

      // html string
      let list = `

			`;

      res.end(list);
    } else if (pathname == "/add") {
      let add = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Sign Up</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
      </head>
      <body>
        <div class="container">
          <h3>Sign Up</h3>
          <form method="post" action="/add" >
            <div class="form-group">
              <label>Username</label>
              <input name="name" type="text" class="form-control" placeholder="Please enter your username">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input name="password" type="password" class="form-control" placeholder="Please enter your password">
            </div>
            <div class="form-group">
              <label>Age</label>
              <input name="age" type="text" class="form-control" placeholder="Please enter your age">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input name="email" type="email" class="form-control" placeholder="Please enter your Email address">
            </div>
            <div class="form-group">
              <label>Hobby</label>
              <div>
                <label class="checkbox-inline">
                  <input type="checkbox" value="football" name="hobbies"> Football
                </label>
                <label class="checkbox-inline">
                  <input type="checkbox" value="basketball" name="hobbies"> Basketball
                </label>
                <label class="checkbox-inline">
                  <input type="checkbox" value="boxing" name="hobbies"> Boxing
                </label>
                <label class="checkbox-inline">
                  <input type="checkbox" value="coding" name="hobbies"> Coding
                </label>
                <label class="checkbox-inline">
                  <input type="checkbox" value="naping" name="hobbies"> Naping
                </label>
                <label class="checkbox-inline">
                  <input type="checkbox" value="cooking" name="hobbies"> Cooking
                </label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Sign Up</button>
          </form>
        </div>
      </body>
      </html>
      `;
      res.end(add);
    } else if (pathname == "/modify") {
      let user = await User.findOne({ _id: query.id });
      let hobbies = [
        "Football",
        "Basketball",
        "Boxing",
        "Coding",
        "Naping",
        "Cooking",
      ];
      let modify = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Update</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
      </head>
      <body>
        <div class="container">
          <h3>Update</h3>
          <form method="post" action="/modify?id=${user._id}" >
            <div class="form-group">
              <label>Username</label>
              <input name="name" value="${user.name}" type="text" class="form-control" placeholder="Please enter your username">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input name="password" value="${user.password}" type="password" class="form-control" placeholder="Please enter your password">
            </div>
            <div class="form-group">
              <label>Age</label>
              <input name="age" value="${user.age}" type="text" class="form-control" placeholder="Please enter your age">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input name="email" value="${user.email}" type="email" class="form-control" placeholder="Please enter your Email address">
            </div>
            <div class="form-group">
              <label>Hobby</label>
              <div>
               `;
      hobbies.forEach((item) => {
        let isHobby = user.hobbies.includes(item);
        if (isHobby) {
          modify += `
                <label class="checkbox-inline">
                  <input type="checkbox" value="${item}" name="hobbies" checked> ${item}
                </label>
`;
        } else {
          modify += `
          <label class="checkbox-inline">
            <input type="checkbox" value="${item}" name="hobbies"> ${item}
          </label>
`;
        }
      });
      modify += `     
      </div>
      </div>
      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </div>
</body>
</html>`;
      res.end(modify);
    } else if (pathname == "/remove") {
      await User.findOneAndDelete({ _id: query.id });
      res.writeHead(301, {
        Location: "/list",
      });
      res.end();
    }
  } else if (method == "POST") {
    if (pathname == "/add") {
      let formData = "";
      req.on("data", (param) => {
        formData += param;
      });
      req.on("end", async () => {
        let user = querystring.parse(formData);
        await User.create(user);

        // 301(redirect) to Loction(/list)
        res.writeHead(301, {
          Location: "/list",
        });
        res.end();
      });
    } else if (pathname == "/modify") {
      let formData = "";
      req.on("data", (param) => {
        formData += param;
      });
      req.on("end", async () => {
        let user = querystring.parse(formData);
        await User.updateOne({ _id: query.id }, user);

        // 301(redirect) to Loction(/list)
        res.writeHead(301, {
          Location: "/list",
        });
        res.end();
      });
    }
  }
});

app.listen(3000);
