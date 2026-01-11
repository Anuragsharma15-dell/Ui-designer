app.get(
    "/api/dashboard",
    ClerkExpressRequireAuth(),
    (req, res) => {
      res.json({
        message: "Welcome",
        userId: req.auth.userId,
      });
    }
  );
  