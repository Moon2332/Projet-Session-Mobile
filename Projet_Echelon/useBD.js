import * as SQLite from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const useBD = () => {
  let bdInstructions = useRef(null);
  let bdNotifications = useRef(null);

  const [instructions, setInstructions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [lastFetched, setLastFetched] = useState(null);

  const { t } = useTranslation()

  useEffect(() => {
    const getBD = async () => {
      try {
        bdInstructions.current = await SQLite.openDatabaseAsync("bd_instructions.db");
        bdNotifications.current = await SQLite.openDatabaseAsync("bd_notifications.db");

        await createInstructionTables();
        await createNotificationTables();

        await getInstructions();
        await getNotifications();
      } catch (e) {
        console.log("Error opening database", e);
      }
    };

    getBD();
  }, []);

  const createInstructionTables = async () => {
    try {
      const resultat = await bdInstructions.current.execAsync(
        `
          CREATE TABLE IF NOT EXISTS instructions(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, 
            orders JSON NOT NULL
          );
        `
      );
    } catch (e) {
      console.log("Error creating instructions table", e);
    }
  };

  const getInstructions = async () => {
    if (bdInstructions.current) {
      try {
        const result = await bdInstructions.current.getAllAsync(`SELECT * FROM instructions`);
        // console.log("In hook", result)
        setInstructions(result);
      } catch (e) {
        console.log("Error fetching instructions", e);
      }
    } else {
      console.log("Database not initialized yet");
    }
  };

  const addInstruction = async (title, orders) => {
    try {
      const jsonOrders = JSON.stringify(orders);
      await bdInstructions.current.runAsync(
        `INSERT INTO instructions (title, orders) VALUES (?, ?)`,
        [title, jsonOrders]
      );
      getInstructions();
    } catch (e) {
      console.log("Error adding instruction", e);
    }
  };

  const editInstruction = async (title, orders, id) => {
    try {
      const jsonOrders = JSON.stringify(orders);
      await bdInstructions.current.runAsync(
        `UPDATE instructions SET title = ?, orders = ? WHERE id = ?`,
        [title, jsonOrders, id]
      );
      getInstructions();
    } catch (e) {
      console.log("Error editing instruction", e);
    }
  };

  const deleteInstruction = async (id) => {
    try {
      await bdInstructions.current.runAsync(
        `DELETE FROM instructions WHERE id = ?`,
        [id]
      );
      getInstructions();
      return "Messages.mapping.delete"
    } catch (e) {
      console.log("Error deleting instruction", e);
      return "Errors.mapping.delete"
    }
  };

  const createNotificationTables = async () => {
    try {
      const resultat = await bdNotifications.current.execAsync(
        `
          CREATE TABLE IF NOT EXISTS notifications(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT, 
            image TEXT,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      );
    } catch (e) {
      console.log("Error creating notifications table", e);
    }
  };

  const getNotifications = async () => {
    if (bdNotifications.current) {
      try {
        let query = `SELECT 
                      id, 
                      type, 
                      image, 
                      strftime('%Y-%m-%d', date) as formatted_date,
                      strftime('%H:%M:%S', date) as time
                    FROM notifications`;

        if (lastFetched) {
          query += ` WHERE date > ?`;
        }

        const result = await bdNotifications.current.getAllAsync(query, [lastFetched] ? [lastFetched] : []);
        if (result.length > 0) {
          // console.log("Resultat DB", result)
          setNotifications(result);

          const latestNotification = result[result.length - 1];
          setLastFetched(latestNotification.date)
        }
        //DROP TABLE IF EXISTS notifications;
        // const result = await bdNotifications.current.getAllAsync(`
        //   SELECT 
        //     id, 
        //     type, 
        //     image, 
        //     strftime('%Y-%m-%d', date) as formatted_date,
        //     strftime('%H:%M:%S', date) as time
        //   FROM notifications
        // `);
        // setNotifications(result);
      } catch (e) {
        console.log("Error fetching notifications", e);
      }
    } else {
      console.log("Notifications database not initialized yet");
    }
  };

  const addNotification = async (type, image, date) => {
    try {
      await bdNotifications.current.runAsync(
        `INSERT INTO notifications (type, image, date) VALUES (?, ?, ?)`,
        [type, image, date]
      );
      getNotifications();
    } catch (e) {
      console.log("Error adding notification", e);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await bdNotifications.current.runAsync(
        `DELETE FROM notifications WHERE id = ?`,
        [id]
      );
      getNotifications();
    } catch (e) {
      console.log("Error deleting notification", e);
    }
  };

  return {
    instructions,
    notifications,
    getInstructions,
    getNotifications,
    addInstruction,
    editInstruction,
    deleteInstruction,
    addNotification,
    deleteNotification,
  };
};

export default useBD;
