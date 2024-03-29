import React from 'react'
import {
    Box, Typography, TextField, Button, List, ListItem, ListItemButton, ListItemText
} from '@mui/material'
import './App.css'


function TextPrompt(props) {
    return (
        <Box sx={{ margin: "1ch" }}>
            {
                props.typed_text
                    .map((word, i) =>
                        <Typography
                            variant='string'
                            key={i}
                            className={
                                (props.displayed_text[i] === word) ?
                                    'ok' : 'wrong'
                            }
                        >
                            {word + ' '}
                        </Typography>
                    )
            }
            {
                props.displayed_text[props.typed_count]
                    .split('')
                    .map((letter, i) =>
                        <Typography
                            key={i}
                            variant='string'
                            className={

                                (props.typed_word[i] === letter) ?
                                    'ok' : (i >= props.typed_word.length) ? '' : 'wrong'
                            }
                        >
                            {letter}
                        </Typography>
                    )
            }
            {' '}
            {
                props.displayed_text
                    .slice(props.typed_count + 1)
                    .map((word, i) =>
                        <Typography key={i} variant='string'>{word + ' '}</Typography>
                    )
            }
        </Box>
    )
}


class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            displayed_text: [''],
            typed_text: [],
            typed_word: '',
            typed_count: 0,
            wrong_count: 0,
            timer: 60,
            started: false,
            finished: false,
            seen_count: 0,
            score_count: 0,
            feed: [],
        }
        this.updateTypedWord = this.updateTypedWord.bind(this);
        this.updateTimer = this.updateTimer.bind(this);
        this.resetTest = this.resetTest.bind(this);
        this.getNextText = this.getNextText.bind(this);
    }

    componentDidMount() {
        const rss_url = "https://news.un.org/feed/subscribe/en/news/all/rss.xml";
        fetch(rss_url)
            .then(response => response.text())
            .then(data => new window.DOMParser().parseFromString(data, 'text/xml'))
            .then(parsed => {
                const items = [...parsed.querySelectorAll("item")];
                const feed = items.map(item => ({
                    title: item.querySelector("title").textContent,
                    description: item.querySelector("description").textContent,
                    url: item.querySelector("link").textContent,
                }))
                this.setState({ feed: feed, displayed_text: feed[0]['description'].split(' ') });
                console.log(feed);
            });
    }

    resetTest() {
        this.setState({
            displayed_text: this.state.feed[this.state.seen_count]['description'].split(' '),
            typed_text: [],
            typed_word: '',
            typed_count: 0,
            wrong_count: 0,
            score_count: 0,
            timer: 60,
            started: false,
            finished: false,

        })
    }

    updateTimer() {

        if (this.state.timer > 0)
            setTimeout(() => {
                this.setState(oldState => ({ timer: oldState.timer - 1 }));
                this.updateTimer();
            }, 1000);
        else
            this.setState(oldState => ({
                started: false,
                finished: true,
                seen_count: (oldState.seen_count + 1 < oldState.feed.length) ? oldState.seen_count + 1 : 0
            })
            );
    }

    updateTypedWord(e) {

        if (!this.state.started)
            this.setState({ started: true }, this.updateTimer);

        const new_tword = e.target.value;
        if (!new_tword.endsWith(' ')) {
            this.setState({ typed_word: new_tword });
        }
        else {
            if (new_tword.length === 1) {
                this.setState({ typed_word: '' });
                return;
            }
            let new_ttext = this.state.typed_text.concat([new_tword.trim()]);
            if (new_ttext.length === this.state.displayed_text.length) {
                this.setState(oldState => ({
                    typed_text: [],
                    typed_count: 0,
                    score_count: oldState.score_count + 1,
                    typed_word: '',
                    wrong_count: (oldState.displayed_text[oldState.typed_count] === new_tword.trim())
                        ? oldState.wrong_count : oldState.wrong_count + 1,
                    seen_count: (oldState.seen_count + 1 < oldState.feed.length) ? oldState.seen_count + 1 : 0,
                    displayed_text: oldState.feed[oldState.seen_count + 1]['description'].split(' ')
                }))
            }
            else {
                this.setState(oldState => ({
                    typed_text: new_ttext,
                    typed_count: oldState.typed_count + 1,
                    score_count: oldState.score_count + 1,
                    typed_word: '',
                    wrong_count: (oldState.displayed_text[oldState.typed_count] === new_tword.trim())
                        ? oldState.wrong_count : oldState.wrong_count + 1,
                }));
            }
        }
    }

    getNextText() {
        this.setState(oldState => ({
            displayed_text: (oldState.seen_count + 1 < oldState.feed.length) ? oldState.feed[oldState.seen_count + 1]['description'].split(' ') : oldState.feed[0]['description'].split(' '),
            seen_count: (oldState.seen_count + 1 < oldState.feed.length) ? oldState.seen_count + 1 : 0,
        }))
    }

    render() {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
            >
                <Box display="flex">
                    <Typography variant='h3'>
                        TypeTrainer
                    </Typography>
                </Box>
                {
                    !this.state.finished &&
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        sx={{ minWidth: 0.75, maxWidth: 0.75, height: 1 }}
                    >
                        <Box className="promptbox" sx={{ minHeight: "6ch", maxHeight: "50%", width: 0.75, minWidth: 0.75, fontSize: "1.8rem", textAlign: "center" }}>
                            <TextPrompt
                                displayed_text={this.state.displayed_text}
                                typed_text={this.state.typed_text}
                                typed_word={this.state.typed_word}
                                typed_count={this.state.typed_count}
                            />
                        </Box>
                        <Box>
                            <TextField variant='outlined' InputProps={{ className: "input-field" }} value={this.state.typed_word} onChange={this.updateTypedWord} />
                        </Box>
                        <Typography>Time: {this.state.timer}</Typography>
                    </Box>
                }
                {
                    this.state.finished &&
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="60vh"
                    >
                        <Typography>WPM: {this.state.score_count}</Typography>
                        <Typography>Mistakes: {this.state.wrong_count}</Typography>
                        <Button variant='outlined' onClick={this.resetTest}>Type again</Button>
                        <Typography variant='h4'>News seen in typed tests</Typography>
                        <List>
                            {
                                this.state.feed.splice(0, this.state.seen_count).map((item, i) => (
                                    <ListItem disablePadding key={i}>
                                        <ListItemButton component="a" href={item.url} rel='noopener noreferrer' target="_blank">
                                            <ListItemText primary={item.title} />
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </Box>
                }
                {
                    !(this.state.started || this.state.finished) &&
                    <Button
                        variant='outlined'
                        size='small'
                        onClick={this.getNextText}
                    >
                        Another Text
                    </Button>
                }
            </Box>

        );
    }
}

export default App;
