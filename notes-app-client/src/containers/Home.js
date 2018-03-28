import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import Button from 'material-ui/Button';
import { invokeApig } from '../libs/awsLib';
import './Home.css';
import notesImg from '../assets/notes.svg';

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
      <ListGroupItem
        key={note.noteId}
        href={`/notes/${note.noteId}`}
        onClick={this.handleNoteClick}
        header={note.content.trim().split('\n')[0]}
      >
        {`Created: ${new Date(note.createdAt).toLocaleString()}`}
      </ListGroupItem>
    ));
  }

  renderLander = () => {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <h4>A note taking app</h4>
        <img
          src={notesImg} className="lander-image"
          alt="notes"
        />
      </div>
    );
  };

  renderNotes() {
    return (
      <div className="notes">
        <div className="notes-header">
          <h3>YOUR NOTES</h3>
          <Button
            variant="raised"
            color="primary"
            href="/notes/new"
            onClick={this.handleNoteClick}
          >
            ADD NOTE
          </Button>
        </div>
        <ListGroup>{!this.state.isLoading && this.renderNotesList(this.state.notes)}</ListGroup>
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
