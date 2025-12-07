const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN LOL ---
const championsList = [
    "Teemo", "Yasuo", "Jinx", "Garen", "Ahri", "Lux", "Darius", "Lee Sin",
    "Zed", "Miss Fortune", "Master Yi", "Ashe", "Blitzcrank", "Malphite",
    "Ezreal", "Caitlyn", "Vi", "Ekko", "Heimerdinger", "Warwick", "Amumu",
    "Sett", "Akali", "Irelia", "Lucian", "Senna", "Pyke", "Shaco", "Viego",
    "Sylas", "Yone", "Kayn", "Thresh", "Mordekaiser", "Kindred", "Jhin",
    "Fiddlesticks", "Volibear", "Ornn", "Sion", "Dr. Mundo", "Singed"
];

let rooms = {};

io.on('connection', (socket) => {
    console.log('Jugador conectado:', socket.id);

    socket.on('joinRoom', ({ roomCode, username }) => {
        socket.join(roomCode);
        
        if (!rooms[roomCode]) {
            rooms[roomCode] = {
                players: [],
                gameStarted: false,
                deck: [...championsList]
            };
        }
        const room = rooms[roomCode];
        
        // Evitar duplicados si reconecta
        const existingPlayer = room.players.find(p => p.id === socket.id);
        if (!existingPlayer) {
            room.players.push({ id: socket.id, name: username });
        }

        io.to(roomCode).emit('updatePlayerList', room.players);
    });

    socket.on('startGame', (roomCode) => {
        const room = rooms[roomCode];
        if (!room || room.players.length < 3) return;

        // 1. Elegir Impostor
        const impostorIndex = Math.floor(Math.random() * room.players.length);
        
        // 2. Sacar carta del mazo
        if (room.deck.length === 0) room.deck = [...championsList]; 
        const randomCardIndex = Math.floor(Math.random() * room.deck.length);
        const secretWord = room.deck[randomCardIndex];
        room.deck.splice(randomCardIndex, 1); 

        // 3. Mezclar orden de hablar
        let speakingOrder = [...room.players];
        for (let i = speakingOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [speakingOrder[i], speakingOrder[j]] = [speakingOrder[j], speakingOrder[i]];
        }
        const orderNames = speakingOrder.map(p => p.name);

        // 4. Enviar datos
        room.players.forEach((player, index) => {
            const isImpostor = (index === impostorIndex);
            io.to(player.id).emit('gameStarted', {
                role: isImpostor ? 'impostor' : 'crew',
                word: isImpostor ? '???' : secretWord,
                order: orderNames
            });
        });
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor listo en puerto ${PORT}`);
});
