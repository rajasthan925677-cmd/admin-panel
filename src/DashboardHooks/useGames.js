// src/DashboardHooks/useGames.js
import { useState, useEffect } from "react";
import * as gameService from "../DashboardServices/GamesService";

const useGames = () => {
  const [games, setGames] = useState([]);
  const [editedGames, setEditedGames] = useState({});
  const [newGames, setNewGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);

  const fetchGames = async () => {
    setLoadingGames(true);
    try {
      const gamesData = await gameService.getGames();
      setGames(gamesData);

      const editState = {};
      gamesData.forEach(game => { editState[game.id] = { ...game }; });
      setEditedGames(editState);
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setLoadingGames(false);
    }
  };

  const saveGame = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to update this game?")) {
      try {
        await gameService.updateGame(id, editedGames[id]);
        fetchGames();
      } catch (err) {
        console.error(err);
        alert("Failed to update game.");
      }
    }
  };

  const deleteGame = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to DELETE this game?")) {
      try {
        await gameService.deleteGame(id);
        fetchGames();
      } catch (err) {
        console.error(err);
        alert("Failed to delete game.");
      }
    }
  };

  const addNewGameRow = () => {
    setNewGames([...newGames, { gameName: "", openTime: "", closeTime: "", openResult: "", closeResult: "" }]);
  };

  const handleNewGameChange = (index, field, value) => {
    const updated = [...newGames];
    updated[index][field] = value;
    setNewGames(updated);
  };

  const saveNewGame = async (index) => {
    if (window.confirm("⚠️ Are you sure you want to add this game?")) {
      try {
        await gameService.addGame(newGames[index]);
        setNewGames(newGames.filter((_, i) => i !== index));
        fetchGames();
      } catch (err) {
        console.error(err);
        alert("Failed to add game.");
      }
    }
  };

  useEffect(() => { fetchGames(); }, []);

  return { games, editedGames, setEditedGames, newGames, addNewGameRow, handleNewGameChange, saveGame, deleteGame, saveNewGame, loadingGames };
};

export default useGames;