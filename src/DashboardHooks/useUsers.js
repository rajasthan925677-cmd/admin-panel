import { useState, useEffect } from "react";
import * as userService from "../DashboardServices/UsersService";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [editedUsers, setEditedUsers] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersData = await userService.getUsers();
      setUsers(usersData);

      const editState = {};
      usersData.forEach(user => {
        editState[user.id] = { ...user };
      });
      setEditedUsers(editState);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const saveUser = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to update this user?")) {
      try {
        await userService.updateUser(id, editedUsers[id]);
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Failed to update user.");
      }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to DELETE this user?")) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("Failed to delete user.");
      }
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return { users, editedUsers, setEditedUsers, loadingUsers, saveUser, deleteUser };
};

export default useUsers;