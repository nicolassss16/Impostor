const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN DE CATEGORÍAS ---
const wordPacks = {
    lol: [
        "Teemo", "Yasuo", "Faker", "Baron Nashor", "Flash", "Grieta del Invocador",
        "Lux", "Darius", "Poro", "Nexos", "Wards", "Yasuo 0/10", "Garen"
    ],
    comida: [
        "Pizza", "Hamburguesa", "Sushi", "Asado", "Empanadas", "Helado",
        "Chocolate", "Tacos", "Ensalada", "Milanesa", "Pancho", "Mate"
    ],
    paises: [
        "Argentina", "Brasil", "España", "Japón", "Estados Unidos", "Francia",
        "Italia", "China", "Rusia", "México", "Alemania", "Qatar"
    ],
    futbol: [
        "Messi", "Cristiano Ronaldo", "Maradona", "Pelé", "Mbappé", "La Bombonera",
        "Monumental", "Mundial", "VAR", "Penal", "Tarjeta Roja", "Dibu Martínez"
    ],
    streamers: [
        "Ibai", "AuronPlay", "Rubius", "Spreen", "Davoo Xeneize", "Coscu",
        "Momo", "Kun Agüero", "TheGrefg", "ElMariana", "Rivers"
    ],
    cosas: [
        "Silla", "Mesa", "Computadora", "Celular", "Cama", "Inodoro",
        "Papel Higiénico", "Espejo", "Ventana", "Puerta", "Televisor"
    ]
};

let rooms = {};

io.on('connection', (socket) => {
    console.log('Jugador conectado:', socket.id);

    // Al unirse, el cliente envía: roomCode, username y category
    socket.on('joinRoom', ({ roomCode, username, category }) => {
        socket.join(roomCode);
        
        // Si la sala no existe, la creamos con la categoría elegida
        if (!rooms[roomCode]) {
            // Validar que la categoría exista, si no, poner default 'cosas'
            const selectedCategory = wordPacks[category] ? category : 'cosas';
            
            rooms[roomCode] = {
                players: [],
                category: selectedCategory, // Guardamos la categoría de la sala
                deck: [...wordPacks[selectedCategory]]
            };
        }
        
        const room = rooms[roomCode];

        // Evitar duplicados
        const existingPlayer = room.players.find(p => p.id === socket.id);
        if (!existingPlayer) {
            room.players.push({ id: socket.id, name: username });
        }

        // Enviamos la lista de jugadores Y la categoría actual de la sala
        io.to(roomCode).emit('updatePlayerList', { 
            players: room.players, 
            category: room.category 
        });
    });

    socket.on('startGame', (roomCode) => {
        const room = rooms[roomCode];
        if (!room || room.players.length < 3) return;

        const impostorIndex = Math.floor(Math.random() * room.players.length);
        
        // Verificar mazo
        if (room.deck.length === 0) {
            room.deck = [...wordPacks[room.category]]; 
        }

        const randomCardIndex = Math.floor(Math.random() * room.deck.length);
        const secretWord = room.deck[randomCardIndex];
        room.deck.splice(randomCardIndex, 1); 

        // Mezclar orden
        let speakingOrder = [...room.players];
        for (let i = speakingOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [speakingOrder[i], speakingOrder[j]] = [speakingOrder[j], speakingOrder[i]];
        }
        const orderNames = speakingOrder.map(p => p.name);

        room.players.forEach((player, index) => {
            const isImpostor = (index === impostorIndex);
            io.to(player.id).emit('gameStarted', {
                role: isImpostor ? 'impostor' : 'crew',
                word: isImpostor ? '???' : secretWord,
                order: orderNames,
                category: room.category // Para mostrar de qué tema estamos hablando
            });
        });
    });

    // Manejo de desconexión (Limpieza)
    socket.on('disconnect', () => {
        for (const roomCode in rooms) {
            const room = rooms[roomCode];
            const playerIndex = room.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                room.players.splice(playerIndex, 1);
                if (room.players.length === 0) {
                    delete rooms[roomCode];
                } else {
                    io.to(roomCode).emit('updatePlayerList', { 
                        players: room.players, 
                        category: room.category 
                    });
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor Multiverso listo en puerto ${PORT}`);
});
