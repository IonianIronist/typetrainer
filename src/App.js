import React from 'react'
import {
    Box, Typography, TextField
} from '@mui/material'

import './App.css'


function TextPrompt(props){
    return(
        <Box className="promptbox">
            {
                props.typed_text
                    .map((word, i) => 
                        <Typography 
                            variant='string' 
                            key={i}
                            className={
                                (props.displayed_text[i] === word)?
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
                    .map((letter, i)=> 
                        <Typography
                            key={i} 
                            variant='string'
                            className={

                                (props.typed_word[i] === letter)?
                                'ok': (i >= props.typed_word.length)? '' : 'wrong'
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


class App extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            displayed_text : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam posuere nibh eget ipsum ultrices, et pharetra quam finibus. Vestibulum sit amet fermentum lacus. Aliquam bibendum in velit finibus ullamcorper. Maecenas volutpat non lacus eu volutpat. In ac tincidunt dolor. Suspendisse nec purus vel velit convallis pretium. Vivamus neque ligula, pretium sed mollis id, gravida sed est.".split(' '),
            typed_text : [],
            typed_word : '',
            typed_count : 0,
            wrong_count : 0,
            timer : 60,
            started: false,
        }
        this.updateTypedWord = this.updateTypedWord.bind(this);
        this.updateTimer = this.updateTimer.bind(this);
    }
    
    updateTimer(){
        
        if(this.state.timer > 0)
            setTimeout(() => {
                this.setState(oldState => ({timer: oldState.timer - 1}));
                this.updateTimer();
            }, 1000);
        else
            this.setState({started: false});
    }

    updateTypedWord(e){
        
        if(!this.state.started)
            this.setState({started: true}, this.updateTimer);

        const new_tword = e.target.value;
        if(!new_tword.endsWith(' ')){
            this.setState({typed_word: new_tword});
        }
        else{
            let new_ttext = this.state.typed_text.concat([new_tword.trim()]);
            
            this.setState(oldState => ({
                typed_text : new_ttext, 
                typed_count : oldState.typed_count + 1,
                typed_word : '',
                wrong_count: (oldState.displayed_text[oldState.typed_count] === new_tword.trim()) 
                    ? oldState.wrong_count : oldState.wrong_count + 1
            }), console.log(new_ttext)
            );
        }
    }

    render(){
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
            >
                <Typography variant='h3'>
                    TypeTrainer
                </Typography>
                <TextPrompt 
                    displayed_text={this.state.displayed_text} 
                    typed_text={this.state.typed_text}
                    typed_word={this.state.typed_word}
                    typed_count={this.state.typed_count}
                />
                <Box>
                    <TextField variant='outlined' style={{margin: '1rem'}} value={this.state.typed_word} onChange={this.updateTypedWord}/>
                </Box>
                <Typography>Mistakes: {this.state.wrong_count}</Typography>
                <Typography>Time: {this.state.timer}</Typography>
            </Box>
        );
    }
}

export default App;
