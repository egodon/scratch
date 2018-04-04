import React, { Component } from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';
import LoaderButton from '../components/LoaderButton';
import { invokeApig, s3Upload } from '../libs/awsLib';
import config from '../config';
import './NewNote.css';

export default class NewNote extends Component {
  static file = null;
  state = {
    isLoading: null,
    content: '',
    file: null,
  };

  validateForm = () => this.state.content.length > 0;

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { file } = this.state;
    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isLoading: true });

    try {
      const uploadedFilename = file
        ? (await s3Upload(file)).Location
        : null;
      await this.createNote({
        content: this.state.content,
        attachment: uploadedFilename,
      });
      this.props.history.push('/');
    } catch (e) {
      console.error(e);
      this.setState({ isLoading: false });
    }
  };

  createNote = (note) => {
    return invokeApig({
      path: '/notes',
      method: 'POST',
      body: note,
    });
  };

  render() {
    return (
      <div className="NewNote">
        <form onSubmit={this.handleSubmit}>
          <FormControl>
            <InputLabel>Note</InputLabel>
            <Input
              id="content"
              multiline
              onChange={this.handleChange}
              value={this.state.content}
              type="textarea"
            />
          </FormControl>
          <div className="NewNote__btns">
            <input
              type="file"
              style={{ display: 'none' }}
              id="file-upload"
              onChange={this.handleFileChange}
            />
            <label htmlFor="file-upload" className="NewNote__upload">
              <Button variant="raised" component="span">
                UPLOAD
              </Button>
              <span className="NewNote__file-name">{this.state.file && this.state.file.name}</span>
            </label>
            <LoaderButton
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Create"
              loadingText="Creating…"
            />
          </div>
        </form>
      </div>
    );
  }
}
