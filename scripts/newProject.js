/* eslint-disable no-console */
/* eslint-disable import/extensions */
import inquirer from 'inquirer';
import fse from 'fs-extra';
import { getAbsoluteFilePath, genMainJsFileContent, assert2str } from './util.js';

const params = process.argv.slice(2);

function initProjectDir(projectDir, includeRouter, includePinia) {
  // 复制模板
  fse.copySync(getAbsoluteFilePath('../template'), projectDir);

  // main.js
  fse.writeFileSync(`${projectDir}/main.js`, genMainJsFileContent(includeRouter, includePinia));
  if (includeRouter || includePinia) {
    console.log(`执行安装 pnpm add ${assert2str(includeRouter, 'vue-router ')}${assert2str(includePinia, 'pinia')}`);
  }
}

function createProject(projectName, includeRouter, includePinia) {
  if (!projectName) {
    console.log('缺失项目名称');
    return;
  }
  // 项目目录
  const projectDir = getAbsoluteFilePath(`../src/packages/${projectName}`);

  const files = fse.readdirSync(projectDir);
  if (files.includes('index.html') || files.includes('main.js')) {
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'override',
          default: false,
          message: `项目目录src/packages/${projectName}不为空，是否覆盖？`,
        },
      ])
      .then((answers) => {
        if (!answers.override) return;
        initProjectDir(projectDir, includeRouter, includePinia);
      });
  } else {
    initProjectDir(projectDir, includeRouter, includePinia);
  }
}

inquirer
  .prompt([
    {
      type: 'input',
      name: 'project',
      when: !params[0],
      message: '请输入项目名称',
    },
    { type: 'confirm', name: 'router', message: '是否使用vue-router？' },
    { type: 'confirm', name: 'pinia', message: '是否使用pinia？' },
  ])
  .then((answers) => {
    createProject(params[0] || answers.project, answers.router, answers.pinia);
  })
  .catch((err) => {
    console.log(err);
  });
