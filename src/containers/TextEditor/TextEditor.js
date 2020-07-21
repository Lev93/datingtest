import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Dropbox from 'dropbox';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'react-i18next';
import './TextEditor.css';
import 'draft-js/dist/Draft.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Button from '../../components/UI/Button/Button';
import keys from '../../../keys/keys';


class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    if (this.props.value) {
      const contentBlock = htmlToDraft(this.props.value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
      }
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  uploadImageCallBack = (file) => new Promise(
    (resolve, reject) => {
      const dbx = new Dropbox.Dropbox({ accessToken: keys.dropboxToken });
      dbx.filesUpload({ path: `/${Date.now()}=${file.name}`, contents: file })
        .then((uploadedFile) => {
          dbx.sharingCreateSharedLinkWithSettings({ path: uploadedFile.path_display })
            .then((res) => {
              const image = res.url.replace('dl=0', 'raw=1');
              this.props.changeImage(image);
              resolve({ data: { link: image } });
            });
        })
        .catch((e) => {
          reject(e);
        });
    },
  );

  render() {
    const { editorState } = this.state;
    return (
      <section className="text-editor">
        <div className="text-editor__conteiner">
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
              image: {
                uploadCallback: this.uploadImageCallBack,
                alt: { present: true, mandatory: true },
                previewImage: true,
                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              },
            }}
          />
          <div className="text-editor__button">
            <label htmlFor="title" className='text-editor__button__label'><Trans>blogCreate.titleName</Trans></label>
            <input type="text" className="input__input" value={this.props.title} onChange={this.props.changeTitle}></input>
            <label htmlFor="category" className='text-editor__button__label'><Trans>blogCreate.category</Trans></label>
            <select id="category" className="input__select" value={this.props.category} onChange={this.props.changeCategory}>
              <option value="dating">{this.props.t('blogs.types.dating')}</option>
              <option value="news">{this.props.t('blogs.types.news')}</option>
              <option value="success">{this.props.t('blogs.types.success')}</option>
              <option value="recomendations">{this.props.t('blogs.types.recomendations')}</option>
            </select>
            <Button classes={'redButton'} type={'button'} clicked={() => this.props.submitBlog(draftToHtml(convertToRaw(editorState.getCurrentContent())))}>blogCreate.create</Button>
          </div>
        </div>
      </section>
    );
  }
}

TextEditor.propTypes = {
  submitBlog: PropTypes.func,
  value: PropTypes.string,
  t: PropTypes.func,
  category: PropTypes.string,
  changeCategory: PropTypes.func,
  title: PropTypes.string,
  changeTitle: PropTypes.func,
  changeImage: PropTypes.func,
};

export default withTranslation()(TextEditor);
