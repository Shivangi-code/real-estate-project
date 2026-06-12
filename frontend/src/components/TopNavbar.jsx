import React, {

  useEffect,

  useMemo,

  useState,

} from "react";

import {

  Phone,

  Bell,

  Trash2,

  CheckCheck,

} from "lucide-react";

import axios from "axios";

import toast from "react-hot-toast";

// ======================================================
// ================= SOCKET =============================
// ======================================================

import socket from "../socket";

// ======================================================
// ================= STYLES =============================
// ======================================================

import "../styles/topnavbar.css";

// ======================================================
// ================= API URL ============================
// ======================================================

const API_URL =

  import.meta.env.VITE_API_URL ||

  "http://localhost:5000";

// ======================================================
// ================= SAFE USER ==========================
// ======================================================

const getSafeUser =
  () => {

    try {

      return JSON.parse(

        localStorage.getItem(
          "user"
        ) || "{}"
      );

    } catch {

      return {};
    }
  };

// ======================================================
// ================= FORMAT TIME ========================
// ======================================================

const formatTimeAgo =
  (dateString) => {

    if (!dateString) {

      return "Just now";
    }

    const now =
      new Date();

    const date =
      new Date(dateString);

    const seconds =
      Math.floor(

        (now - date) / 1000
      );

    if (
      seconds < 60
    ) {

      return "Just now";
    }

    const minutes =
      Math.floor(
        seconds / 60
      );

    if (
      minutes < 60
    ) {

      return `${minutes}m ago`;
    }

    const hours =
      Math.floor(
        minutes / 60
      );

    if (
      hours < 24
    ) {

      return `${hours}h ago`;
    }

    const days =
      Math.floor(
        hours / 24
      );

    return `${days}d ago`;
  };

// ======================================================
// ================= COMPONENT ==========================
// ======================================================

function TopNavbar() {

  // ======================================================
  // ================= USER ===============================
  // ======================================================

  const user =
    useMemo(
      () =>
        getSafeUser(),
      []
    );

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [

    isNotificationOpen,

    setIsNotificationOpen,

  ] = useState(false);

  const [

    notifications,

    setNotifications,

  ] = useState([]);

  const [

    unreadCount,

    setUnreadCount,

  ] = useState(0);

  const [

    loading,

    setLoading,

  ] = useState(false);

  // ======================================================
  // ================= TOKEN ==============================
  // ======================================================

  const token =
    localStorage.getItem(
      "token"
    );

  // ======================================================
  // ================= FETCH NOTIFICATIONS ===============
  // ======================================================

  const fetchNotifications =
    async () => {

      try {

        if (
          !token
        ) {

          return;
        }

        setLoading(
          true
        );

        const response =
          await axios.get(

            `${API_URL}/api/user-auth/notifications`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setNotifications(

          response.data
            ?.notifications ||

            []
        );

        setUnreadCount(

          response.data
            ?.unreadCount ||

            0
        );

      } catch (
        error
      ) {

        console.log(

          "Fetch Notifications Error ❌",

          error
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  // ======================================================
  // ================= INITIAL LOAD ======================
  // ======================================================

  useEffect(() => {

    if (
      user?._id &&
      token
    ) {

      fetchNotifications();
    }

  }, []);

  // ======================================================
  // ================= LIVE SOCKET EVENTS ================
  // ======================================================

  useEffect(() => {

    const handleLiveNotification =
      (
        notification
      ) => {

        setNotifications(
          (
            prev
          ) => [

            {

              ...notification,

              isRead: false,

              createdAt:
                new Date(),
            },

            ...prev,
          ]
        );

        setUnreadCount(
          (
            prev
          ) => prev + 1
        );
      };

    socket.on(

      "moderationNotification",

      handleLiveNotification
    );

    return () => {

      socket.off(

        "moderationNotification",

        handleLiveNotification
      );
    };

  }, []);

  // ======================================================
  // ================= MARK ALL READ =====================
  // ======================================================

  const markAllAsRead =
    async () => {

      try {

        await axios.patch(

          `${API_URL}/api/user-auth/notifications/read-all`,

          {},

          {

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setNotifications(
          (
            prev
          ) =>

            prev.map(
              (
                notification
              ) => ({

                ...notification,

                isRead: true,
              })
            )
        );

        setUnreadCount(
          0
        );

        toast.success(
          "Notifications marked as read"
        );

      } catch (
        error
      ) {

        console.log(

          "Read Notifications Error ❌",

          error
        );

        toast.error(
          "Failed to mark notifications"
        );
      }
    };

  // ======================================================
  // ================= DELETE ONE ========================
  // ======================================================

  const deleteNotification =
    async (
      id
    ) => {

      try {

        await axios.delete(

          `${API_URL}/api/user-auth/notifications/${id}`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const updated =
          notifications.filter(

            (
              notification
            ) =>

              notification._id !==
              id
          );

        setNotifications(
          updated
        );

        setUnreadCount(

          updated.filter(
            (
              notification
            ) =>

              !notification.isRead
          ).length
        );

        toast.success(
          "Notification removed"
        );

      } catch (
        error
      ) {

        console.log(

          "Delete Notification Error ❌",

          error
        );

        toast.error(
          "Failed to delete notification"
        );
      }
    };

  // ======================================================
  // ================= CLEAR ALL =========================
  // ======================================================

  const clearAllNotifications =
    async () => {

      try {

        await axios.delete(

          `${API_URL}/api/user-auth/notifications`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setNotifications(
          []
        );

        setUnreadCount(
          0
        );

        toast.success(
          "All notifications cleared"
        );

      } catch (
        error
      ) {

        console.log(

          "Clear Notifications Error ❌",

          error
        );

        toast.error(
          "Failed to clear notifications"
        );
      }
    };

  // ======================================================
  // ================= RETURN =============================
  // ======================================================

  return (

    <div className="top-navbar">

      {/* ====================================================== */}
      {/* ================= LEFT INFO ========================== */}
      {/* ====================================================== */}

      <div className="top-left">

        <span className="desktop-location">

          📍 Jabalpur, Madhya Pradesh

        </span>

        <span className="mobile-location">

          📍 Jabalpur

        </span>

        <span>

          • Local team • Quick response

        </span>

      </div>

      {/* ====================================================== */}
      {/* ================= RIGHT SECTION ====================== */}
      {/* ====================================================== */}

      <div className="top-right">

        {/* ====================================================== */}
        {/* ================= NOTIFICATION ======================= */}
        {/* ====================================================== */}

        {user?._id && (

          <div className="notification-wrapper">

            {/* ====================================================== */}
            {/* ================= BELL BUTTON ======================== */}
            {/* ====================================================== */}

            <button

              className="notification-btn"

              onClick={() =>
                setIsNotificationOpen(
                  (
                    prev
                  ) => !prev
                )
              }
            >

              <Bell size={18} />

              {unreadCount > 0 && (

                <span className="notification-badge">

                  {unreadCount > 99

                    ? "99+"

                    : unreadCount}

                </span>
              )}

            </button>

            {/* ====================================================== */}
            {/* ================= DROPDOWN =========================== */}
            {/* ====================================================== */}

            {isNotificationOpen && (

              <div className="notification-dropdown">

                {/* ====================================================== */}
                {/* ================= HEADER ============================= */}
                {/* ====================================================== */}

                <div className="notification-header">

                  <h4>

                    Notifications

                  </h4>

                  <div className="notification-actions">

                    {notifications.length > 0 && (

                      <>

                        <button

                          onClick={
                            markAllAsRead
                          }

                          className="notification-action-btn"
                        >

                          <CheckCheck
                            size={14}
                          />

                        </button>

                        <button

                          onClick={
                            clearAllNotifications
                          }

                          className="notification-action-btn delete-all"
                        >

                          <Trash2
                            size={14}
                          />

                        </button>

                      </>
                    )}

                  </div>

                </div>

                {/* ====================================================== */}
                {/* ================= BODY =============================== */}
                {/* ====================================================== */}

                <div className="notification-body">

                  {loading ? (

                    <div className="notification-empty">

                      Loading...

                    </div>

                  ) : notifications.length === 0 ? (

                    <div className="notification-empty">

                      No notifications yet

                    </div>

                  ) : (

                    notifications.map(
                      (
                        notification
                      ) => (

                        <div

                          key={
                            notification._id
                          }

                          className={`notification-item ${
                            !notification.isRead
                              ? "unread"
                              : ""
                          }`}
                        >

                          {/* ====================================================== */}
                          {/* ================= CONTENT ============================ */}
                          {/* ====================================================== */}

                          <div className="notification-content">

                            <div className="notification-title">

                              <span className="notification-icon">

                                {notification.icon ||
                                  "🔔"}

                              </span>

                              <span>

                                {notification.title}

                              </span>

                            </div>

                            {notification.message && (

                              <p className="notification-message">

                                {notification.message}

                              </p>
                            )}

                            <span className="notification-time">

                              {formatTimeAgo(
                                notification.createdAt
                              )}

                            </span>

                          </div>

                          {/* ====================================================== */}
                          {/* ================= DELETE ============================= */}
                          {/* ====================================================== */}

                          <button

                            onClick={() =>
                              deleteNotification(
                                notification._id
                              )
                            }

                            className="notification-delete-btn"
                          >

                            <Trash2
                              size={13}
                            />

                          </button>

                        </div>
                      )
                    )
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* ====================================================== */}
        {/* ================= DESKTOP CALL ======================= */}
        {/* ====================================================== */}

        <button className="call-btn desktop-call">

          <Phone size={16} />

          Call / WhatsApp:
          +91-7415930089

        </button>

        {/* ====================================================== */}
        {/* ================= MOBILE CALL ======================== */}
        {/* ====================================================== */}

        <a

          href="tel:+917415930089"

          className="mobile-call-btn"
        >

          <Phone size={13} />

          <span>

            +91-7415930089

          </span>

        </a>

      </div>

    </div>
  );
}

export default TopNavbar;