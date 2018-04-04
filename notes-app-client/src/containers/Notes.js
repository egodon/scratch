import React, { Component } from 'react';
import Input from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { invokeApig, s3Upload } from '../libs/awsLib';
import './Notes.css';

export default class Notes extends Component {
  state = {
    isLoading: null,
    isDeleting: null,
    note: null,
    content: '',
    file: null,
  };

  async componentDidMount() {
    try {
      const results = await this.getNote();
      this.setState({
        note: results,
        content: results.content,
        file: results.attachment,
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return invokeApig({
      path: `/notes/${this.props.match.params.id}`,
    });
  }
  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.length < 50
      ? str
      : `${str.substr(0, 20)}...${str.substr(str.length - 20, str.length)}`;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  saveNote(note) {
    return invokeApig({
      path: `/notes/${this.props.match.params.id}`,
      method: 'PUT',
      body: note,
    });
  }

  handleSubmit = async (event) => {
    let uploadedFilename;
    event.preventDefault();
    if (this.state.file && this.state.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }
    this.setState({ isLoading: true });
    try {
      if (this.state.file) {
        uploadedFilename = (await s3Upload(this.state.file)).Location;
      }
      await this.saveNote({
        ...this.state.note,
        content: this.state.content,
        attachment: uploadedFilename || this.state.note.attachment,
      });
      this.props.history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  deleteNote() {
    return invokeApig({
      path: `/notes/${this.props.match.params.id}`,
      method: 'DELETE',
    });
  }

  handleDelete = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    );
    if (!confirmed) {
      return;
    }
    this.setState({ isDeleting: true });
    try {
      await this.deleteNote();
      this.props.history.push('/');
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  };

  render() {
    const { file, note } = this.state;
    console.log(this.state);
    return (
      <div className="Notes">
        {this.state.note && (
          <form onSubmit={this.handleSubmit}>
            <FormControl>
              <Input
                multiline
                id="content"
                onChange={this.handleChange}
                value={this.state.content}
              />
            </FormControl>
            <input
              type="file"
              style={{ display: 'none' }}
              id="add-file-upload"
              onChange={this.handleFileChange}
            />

            <label htmlFor="add-file-upload" className="Notes__upload">
              <Button variant="raised" component="span">
                UPLOAD
              </Button>
              <span className="Notes__file-name">{file && file.name}</span>
            </label>
            <div className="Notes__btns">
              <LoaderButton
                disabled={!this.validateForm()}
                type="submit"
                isLoading={this.state.isLoading}
                text="Save"
                loadingText="Saving…"
              />
              <LoaderButton
                isLoading={this.state.isDeleting}
                onClick={this.handleDelete}
                text="Delete"
                loadingText="Deleting…"
              />
            </div>
          </form>
        )}
      </div>
    );
  }
}
