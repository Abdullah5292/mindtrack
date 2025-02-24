import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { loggedIn, admin, detailsEntered } = useSelector((state) => state.user);
  const appSettings = useSelector((state) => state.app.settings);
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (process.env.NODE_ENV === "development" && !ignore.current) {
      ignore.current = true;
      return;
    }

    const type = router.pathname.split("/")[1];
    if (!loggedIn && router.pathname !== "/auth/login")
      router.replace("/auth/login").catch(console.error);
    else if (admin && type !== "admin") router.replace("/admin/home").catch(console.error);
    else if (admin && appSettings.maintenanceMode) router.replace("/admin/editSettings").catch(console.error);
    else if (!admin && type !== "student") router.replace("/student/home").catch(console.error);
    else if (!admin && appSettings.maintenanceMode) router.replace("/maintenance").catch(console.error);
    else setChecked(true);
    // else if (!admin && !detailsEntered && router.pathname !== "/student/account")
    //   router.replace('/student/account').catch(console.error);
  }, [router.pathname, loggedIn, admin]);

  if (!checked) return null;

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};