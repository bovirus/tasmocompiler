import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import BackButton from '../BackButton';
import CompileButton from '../CompileButton';
import VersionSelector from './VersionSelector';
import languages from './Variables/Languages';
import { FormattedMessage } from 'react-intl';

class VersionStep extends Component {
  constructor(props) {
    super(props);

    // Search the current locale of browser on languages
    var languageIndex = languages.findIndex((element) =>
      element.value.includes(navigator.language)
    );
    // Set English if not found current locale of browser on languages
    if (languageIndex === -1) {
      languageIndex = languages.findIndex((element) =>
        element.value.includes('en')
      );
    }

    this.state = {
      tasmotaVersion: 'development',
      MY_LANGUAGE: languages[languageIndex].value,
      message: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCompile = this.handleCompile.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleChange(event) {
    let memoryBuildFlag;
    const { boardVersion, coreVersion } = this.state;

    if (event.target.name === 'coreVersion') {
      const mbf = event.target.value.mem_prefix;
      if (boardVersion.mem === 4) {
        memoryBuildFlag = `${mbf}4m1m.ld`;
      } else {
        // memory 1Mbit
        memoryBuildFlag = `${mbf}1m0.ld`;
        if (
          event.target.value.platform.startsWith('core_2_6_') ||
          event.target.value.platform.startsWith('core_2_7_')
        ) {
          memoryBuildFlag = `${mbf}1m.ld`;
        }
      }
    }

    if (event.target.name === 'boardVersion') {
      const mbf = coreVersion.mem_prefix;
      if (event.target.value.mem === 4) {
        memoryBuildFlag = `${mbf}4m1m.ld`;
      } else {
        memoryBuildFlag = `${mbf}1m0.ld`;
        if (
          coreVersion.platform.startsWith('core_2_6_') ||
          coreVersion.platform.startsWith('core_2_7_')
        ) {
          memoryBuildFlag = `${mbf}1m.ld`;
        }
      }
    }

    if (memoryBuildFlag) {
      this.setState({
        [event.target.name]: event.target.value,
        memoryBuildFlag,
      });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  handleCompile() {
    const { compileHandler } = this.props;
    compileHandler({ version: this.state });
  }

  handleBack() {
    const { backHandler } = this.props;
    backHandler();
  }

  render() {
    const { message, tasmotaVersion, MY_LANGUAGE } = this.state;

    const {
      classes,
      backHandler,
      repoTags,
      compiling,
      compileHandler,
      ...other
    } = this.props;

    return (
      <Step {...other}>
        <StepLabel error={message.length > 0 && other.active}>
          <FormattedMessage id="stepVersionTitle" />
        </StepLabel>
        <StepContent>
          <Typography>
            <FormattedMessage id="stepVersionDesc" />
          </Typography>
          <form className={classes.actionsContainer} autoComplete="off">
            <VersionSelector
              items={repoTags}
              name="tasmotaVersion"
              value={tasmotaVersion}
              label={<FormattedMessage id="stepVersionTasmota" />}
              onChange={this.handleChange}
              classes={classes}
            />
            <VersionSelector
              items={languages}
              name="MY_LANGUAGE"
              value={MY_LANGUAGE}
              label={<FormattedMessage id="stepVersionLanguage" />}
              onChange={this.handleChange}
              classes={classes}
            />
          </form>
          <div className={classes.actionsContainer}>
            <div className={classes.wrapper}>
              <BackButton disabled={compiling} onClick={this.handleBack} />
            </div>
            <div className={classes.wrapper}>
              <CompileButton
                disabled={compiling}
                onClick={this.handleCompile}
              />
              {compiling && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </div>
          {message && (
            <Typography color="error" variant="subtitle1">
              Error:
              {message}
            </Typography>
          )}
        </StepContent>
      </Step>
    );
  }
}

VersionStep.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.object]).isRequired,
  repoTags: PropTypes.oneOfType([PropTypes.array]).isRequired,
  compiling: PropTypes.bool.isRequired,
  compileHandler: PropTypes.func.isRequired,
  backHandler: PropTypes.func.isRequired,
};

export default VersionStep;
