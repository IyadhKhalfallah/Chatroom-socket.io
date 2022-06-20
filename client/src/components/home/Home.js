import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React, { useRef, useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { Redirect } from 'react-router-dom';
import RoomList from './RoomList';
import io from 'socket.io-client';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

let socket;
export default function BasicTabs() {
    const [value, setValue] = useState(0);
    const { user, setUser } = useContext(UserContext);
    const [room, setRoom] = useState('');
    const [room_id, setRoomId] = useState('')
    const [rooms, setRooms] = useState([]);
    const [showID, setShowID] = useState(false)
    const [copySuccess, setCopySuccess] = useState('');
    const [joinEror, setJoinError] = useState('')
    const textAreaRef = useRef(null);
    const ENDPT = 'localhost:5000';
    useEffect(() => {
        socket = io(ENDPT);
        return () => {
            socket.disconnect();
            socket.off();
        }
    }, [ENDPT])
    useEffect(() => {
        socket.on('output-rooms', rooms => {
            setRooms(rooms.filter(room => room.users.includes(user._id)))
        })

    }, [])
    useEffect(() => {
        socket.on('room-created', room => {
            setRoomId(room._id)
            setRooms([...rooms, room])
        })
    }, [rooms])
    useEffect(() => {
        socket.on('room-joined', room => {
            setRooms([...rooms, room])
        })
    }, [rooms])

    const handleSubmit = e => {
        e.preventDefault();
        socket.emit('create-room', { name: room, user_id: user._id });
        setShowID(true);
        setRoom('');

    }
    function copyToClipboard(e) {
        textAreaRef.current.select();
        document.execCommand('copy');
        e.target.focus();
        setCopySuccess('Copied!');
    };
    const handleJoinSubmit = async e => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/is-room-full', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ room_id }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.status !== 400) {
            const data = await res.json()
            if (!data) {
                socket.emit('join-room', { room_id, user_id: user._id });
                setRoomId('');
            }
            else {
                setJoinError('Room is full')
            }
        }

    }
    if (!user) {
        return <Redirect to='/login' />
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Create room" {...a11yProps(0)} />
                    <Tab label="Join room" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <div>
                    <div className="row">
                        <div className="col s12 m6">
                            <span className="card-title">Welcome {user ? user.name : ''}</span>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label>Room</label>
                                    <input
                                        placeholder="Enter a room name"
                                        id="room" type="text" className="validate"
                                        value={room}
                                        onChange={e => setRoom(e.target.value)}
                                    />
                                    {showID ? <div><p>Your room ID is: <textarea
                                        ref={textAreaRef}
                                        value={room_id}
                                    /></p>
                                        <div>
                                            <button className="btn btn-secondary" onClick={copyToClipboard}>Copy ID</button>
                                            {copySuccess}
                                        </div>
                                    </div> : null}
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Create Room
                                </button>
                            </form>
                        </div>
                        <hr
                            style={{
                                background: 'transparent',
                                color: 'transparent',
                                borderColor: 'transparent',
                                height: '3px',
                            }}
                        />
                        <div className="row">
                            <h3> Your rooms </h3>
                            <RoomList rooms={rooms} />
                        </div>
                    </div>

                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div>
                    <div className="row">
                        <div className="col s12 m6">
                            <span className="card-title">Welcome {user ? user.name : ''}</span>
                            <form onSubmit={handleJoinSubmit}>
                                <div className="mb-3">
                                    <label>Room ID</label>
                                    <input
                                        placeholder="Enter a room ID"
                                        id="room" type="text" className="validate"
                                        value={room_id}
                                        onChange={e => setRoomId(e.target.value)}
                                    />
                                </div>
                                <div className="error red-text">{joinEror}</div>
                                <button type="submit" className="btn btn-primary">
                                    Join Room
                                </button>
                            </form>
                        </div>
                        <hr
                            style={{
                                background: 'transparent',
                                color: 'transparent',
                                borderColor: 'transparent',
                                height: '3px',
                            }}
                        />
                        <div className="row">
                            <h3> Your rooms </h3>
                            <RoomList rooms={rooms} />
                        </div>
                    </div>

                </div>
            </TabPanel>
        </Box>
    );
}
