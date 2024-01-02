import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Share.module.css";
import { BASE_URL, privateFetch } from "../services/privateFetch";
import { useCities } from "../contexts/CitiesContext";

export default function Share() {
  const { user, token, refresh, logout, isAuthenticated } = useAuth();
  const { cities } = useCities();
  const [isShared, setIsShared] = useState(user?.shareMode);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const linkRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    // Select the text in the link
    // linkRef.current.select();
    navigator.clipboard.writeText(linkRef.current.innerText);
    // console.log(linkRef.current.innerText);

    // document.("copy");
    setIsCopied(true);
    const id = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    return () => clearTimeout(id);
  };

  if (!isAuthenticated || cities.length === 0) {
    return <div className={styles.share}></div>;
  }

  async function handleShare() {
    setIsShareLoading(true);
    const url = `${BASE_URL}/api/users/${user._id}`;

    const res = await privateFetch(
      `${url}`,
      {
        method: "PATCH",
        body: JSON.stringify({ shareMode: !isShared }),
      },
      token,
      refresh
    );

    setIsShareLoading(false);

    if (res.error) {
      console.error(res.error);
      if (res.code === 401) {
        logout();
        return false;
      }
      return;
    }

    setIsShared((isShared) => !isShared);
  }

  // const shareLink = `${window.location.host}/share/${user.email.split("@")[0]}`
  const shareLink = `${window.location.origin}/share/${user._id}`;

  return (
    <div className={styles.share}>
      <button
        className={isShared ? styles.unshareBtn : styles.shareBtn}
        onClick={handleShare}
        disabled={isShareLoading}
      >
        {isShareLoading
          ? "Loading..."
          : isShared
          ? "Stop Sharing"
          : "Share with friends"}
      </button>

      {isShared && (
        <div>
          <p>Share this link with your friends:</p>
          <div className={styles.shareLink}>
            <a ref={linkRef} href={shareLink} target="_blank">
              {shareLink}
            </a>
            <button
              onClick={copyToClipboard}
              className={isCopied ? styles.copied : ""}
              // disabled={isCopied}
            >
              {isCopied ? (
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  data-darkreader-inline-fill=""
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                  ></path>
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z"
                  ></path>
                </svg>
              ) : (
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  data-darkreader-inline-fill=""
                >
                  <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z"></path>
                  <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
