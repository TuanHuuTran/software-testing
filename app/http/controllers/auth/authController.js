import User from "../../../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";

const authController = () => {
  const _getRedirectUrl = (user) =>
    user.role === "admin" ? "/admin/orders" : "/customer/orders";

  const login = (req, res) => {
    res.render("auth/login");
  };

  const postLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash("error", "All fields are required");
      return res.redirect("/login");
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        req.flash("error", "Something went wrong");
        return next(err);
      }
      if (!user) {
        req.flash("error", info?.message || "Invalid email or password");
        return res.redirect("/login");
      }

      req.logIn(user, (err) => {
        if (err) {
          req.flash("error", "Login failed");
          return next(err);
        }
        return res.redirect(_getRedirectUrl(user));
      });
    })(req, res, next);
  };

  const register = (req, res) => {
    res.render("auth/register");
  };

  const postRegister = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      req.flash("error", "All fields are required");
      req.flash("name", name);
      req.flash("email", email);
      return res.redirect("/register");
    }

    try {
      const userExists = await User.exists({ email }).exec();
      if (userExists) {
        req.flash("error", "Email already taken");
        req.flash("name", name);
        req.flash("email", email);
        return res.redirect("/register");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });

      await user.save();
      return res.redirect("/");
    } catch (err) {
      req.flash("error", "Something went wrong");
      return res.redirect("/register");
    }
  };

  const logout = async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/login");
    });
  };

  return { login, postLogin, register, postRegister, logout };
};

export default authController;
