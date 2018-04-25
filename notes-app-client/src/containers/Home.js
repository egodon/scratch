import React, { Component, Fragment } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import { invokeApig } from '../libs/awsLib';
import './Home.css';
import notesImg from '../assets/notes.svg';
import Divider from 'material-ui/Divider/Divider';

export default class Home extends Component {
  state = {
    isLoading: true,
    notes: [],
  };

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    try {
      const results = await this.notes();
      this.setState({ notes: results });
    } catch (e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }

  notes = () => {
    return invokeApig({ path: '/notes' });
  };

  handleNoteClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  };

  renderNotesList(notes) {
    return (notes || []).map((note, i) => (
      <Fragment key={note.noteId}>
        <ListItem
          href={`/notes/${note.noteId}`}
          onClick={this.handleNoteClick}
          header={note.content.trim().split('\n')[0]}
          className="notes-item"
          button
        >
          <ListItemText
            primary={note.content.trim().split('\n')[0]}
            secondary={`Created: ${new Date(note.createdAt).toLocaleString()}`}
          />
        </ListItem>
        <Divider />
      </Fragment>
    ));
  }

  renderLander = () => {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <h4>A note taking app</h4>
        <img src={notesImg} className="lander-image" alt="notes" />
      </div>
    );
  };

  renderNotes() {
    return (
      <div className="notes">
        <div className="notes-header">
          <h2>YOUR NOTES</h2>
          <Button variant="raised" color="primary" href="/notes/new" onClick={this.handleNoteClick}>
            ADD NOTE
          </Button>
        </div>
        {this.state.isLoading ? (
          <CircularProgress size={50} className="notes-loading" />
        ) : (
          <List>{this.renderNotesList(this.state.notes)}</List>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}
