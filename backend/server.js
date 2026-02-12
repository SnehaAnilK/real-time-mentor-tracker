const express = require('express');
const cors = require('cors'); 
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors()); 
const server = http.createServer(app);

const supabaseUrl = 'https://jjpawqwupvnnvxkmpgkc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcGF3cXd1cHZubnZ4a21wZ2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzExNTYsImV4cCI6MjA4NDY0NzE1Nn0.86LAw6IJE2adFkXtFODRLT1v7evI0NTpT7G8jTYbHcc';
const supabase = createClient(supabaseUrl, supabaseKey);

const io = new Server(server, { cors: { origin: "*" } });

// REST API: weekly analytics
app.get('/api/analytics/:mentorId', async (req, res) => {
    const { data, error } = await supabase.from('weekly_mentor_stats').select('*').eq('mentor_id', req.params.mentorId);
    if (error) return res.status(500).json(error);
    res.json(data[0] || { total_sessions: 0, total_minutes: 0 });
});

// REST API: Recent history
app.get('/api/history/:mentorId', async (req, res) => {
    console.log(`FETCHING HISTORY FOR: ${req.params.mentorId}`); // DEBUG LOG
    const { data, error } = await supabase
        .from('mentor_sessions')
        .select('id, start_time, duration_minutes')
        .eq('mentor_id', req.params.mentorId)
        .order('start_time', { ascending: false })
        .limit(5);
    if (error) return res.status(500).json(error);
    res.json(data);
});

let timers = {}; 
io.on('connection', (socket) => {
  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    let lat = 12.9344; let lng = 77.5345;
    timers[socket.id] = setInterval(() => {
      lat += 0.0001; lng += 0.0001;
      io.to(sessionId).emit('location-receive', { lat, lng });
    }, 2000);
    socket.on('save-session', async (data) => {
      if (timers[socket.id]) clearInterval(timers[socket.id]);
      await supabase.from('mentor_sessions').insert([{
        mentor_id: data.mentor_id,
        duration_minutes: data.duration,
        points_captured: data.path.length,
        path_data: data.path
      }]);
      console.log(" Session saved");
    });
    socket.on('disconnect', () => { if (timers[socket.id]) clearInterval(timers[socket.id]); });
  });
});

server.listen(3000, '0.0.0.0', () => console.log(' Server ready'));