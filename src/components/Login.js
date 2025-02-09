// Login.js
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardContent } from "./Card";
import { Input } from "./Input";
import Button from "./Button";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Alert } from "./Alert";
import { motion } from "framer-motion";
import "./Login.css";
import Header from "./Header";
import Footer from "./Footer";

const WelcomeMessage = () => (
  <motion.div
    className="welcome-message text-center px-4 py-8"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <h2
      className="text-white text-3xl font-extrabold mb-4 sm:text-2xl"
      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
    >
      Bienvenue chez Mr. Renaudin Barbershop
    </h2>
    <p
      className="text-white text-xl mb-6 sm:text-base"
      style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
    >
      Redécouvrez l'excellence de la coiffure à domicile ! Nos barbiers experts vous
      offrent des coupes sur-mesure, alliant élégance et modernité pour sublimer votre
      style. Créez votre compte dès aujourd'hui et offrez-vous une expérience personnalisée
      et luxueuse, directement chez vous.
    </p>
    <Button
      className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full shadow-lg"
      onClick={() =>
        document.getElementById("login-form")?.scrollIntoView({ behavior: "smooth" })
      }
    >
      Rejoignez-nous dès maintenant
    </Button>
  </motion.div>
);

const LoginForm = ({
  isLogin,
  username,
  password,
  role,
  errorMessage,
  handleSubmit,
  setUsername,
  setPassword,
  setRole,
  setIsLogin,
  loading,
}) => (
  <motion.div
    id="login-form"
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="mx-auto max-w-md"
  >
    <Card className="login-form bg-white rounded-lg shadow-xl">
      <CardHeader className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold mb-2 sm:text-xl">
          {isLogin ? "Connexion" : "Créer un compte"}
        </h1>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {!isLogin && (
            <RadioGroup
              onValueChange={(value) => setRole(value)}
              defaultValue={role}
              className="flex justify-around my-4"
            >
              <div className="flex flex-col items-center">
                <RadioGroupItem value="client" id="client" />
                <label htmlFor="client" className="mt-1 text-sm">
                  Client
                </label>
              </div>
            </RadioGroup>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {isLogin ? "Se connecter" : "S’inscrire"}
          </Button>
          <div className="text-center mt-4">
            <p className="text-gray-700 text-sm">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
            </p>
            <Button
              type="button"
              variant="link"
              onClick={() => setIsLogin((prev) => !prev)}
              className="text-blue-700 font-semibold"
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </Button>
          </div>
          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              {errorMessage}
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  </motion.div>
);

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // Verify and decode the token whenever it changes
  useEffect(() => {
    if (token) {
      try {
        const [, payload] = token.split(".");
        const decodedToken = JSON.parse(atob(payload));
        const userRole = decodedToken.role;
        const userId = decodedToken.id;
        onLogin(userRole, userId, token);
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  }, [token, onLogin]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!username || !password) {
        setErrorMessage("Veuillez remplir tous les champs.");
        return;
      }
      setLoading(true);
      const endpoint = isLogin ? "/login" : "/register";
      const body = isLogin
        ? { username, password }
        : { username, password, role };

      try {
        const response = await fetch(`/api/auth${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.ok) {
          // Assuming the server returns: { user: { id, username, role }, token }
          const userRole = isLogin ? data.user.role : role;
          const userId = data.user.id || null;
          const userToken = data.token;
          localStorage.setItem("token", userToken);
          setToken(userToken);
          onLogin(userRole, userId, userToken);
          setErrorMessage("");
        } else {
          setErrorMessage(data.message || "Erreur lors de la connexion.");
        }
      } catch (error) {
        console.error("Erreur serveur:", error);
        setErrorMessage("Erreur serveur.");
      } finally {
        setLoading(false);
      }
    },
    [isLogin, username, password, role, onLogin]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    onLogin(null, null, null);
  }, [onLogin]);

  return (
    <div
      className="min-h-screen flex flex-col relative login-bg"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col z-10">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {token ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-white text-3xl font-bold mb-4">
                Vous êtes connecté !
              </h2>
              <Button
                onClick={handleLogout}
                className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded"
              >
                Se déconnecter
              </Button>
              <div className="mt-4 text-white text-lg">
                {role === "client"
                  ? "Accédez à votre espace client pour un service personnalisé."
                  : "Accédez à l'espace admin."}
              </div>
            </motion.div>
          ) : (
            <>
              <WelcomeMessage />
              <LoginForm
                isLogin={isLogin}
                username={username}
                password={password}
                role={role}
                errorMessage={errorMessage}
                handleSubmit={handleSubmit}
                setUsername={setUsername}
                setPassword={setPassword}
                setRole={setRole}
                setIsLogin={setIsLogin}
                loading={loading}
              />
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
