/* eslint-disable no-console */
/* eslint-disable import/extensions */
import inquirer from 'inquirer';
import fse from 'fs-extra';
import { execSync } from 'child_process';
import JSON5 from 'json5';
import {
  getAbsoluteFilePath, genMainJsFileContent, assert2str, importFile,
} from './util.mjs';

const params = process.argv.slice(2);

/**
 * 开始初始化创建
 * @param {string} projectName 项目名称
 * @param {bool} includeRouter 是否使用vue-router
 * @param {bool} includePinia 是否使用pinia
 * @returns
 */
async function runCreateProject(projectName, includeRouter, includePinia) {
  // 项目目录
  const projectDir = getAbsoluteFilePath(`../src/packages/${projectName}`);
  // 复制模板
  fse.copySync(getAbsoluteFilePath('../template'), projectDir);

  // main.js
  fse.writeFileSync(`${projectDir}/main.js`, genMainJsFileContent(includeRouter, includePinia));
  if (includeRouter || includePinia) {
    console.log(`执行安装 pnpm add ${assert2str(includeRouter, 'vue-router ')}${assert2str(includePinia, 'pinia')}`);
  }

  // eslint配置文件夹引用alias
  const eslintConfigPath = getAbsoluteFilePath('../.eslintrc.js');
  const eslintConfigRes = await importFile(eslintConfigPath);
  if (eslintConfigRes) {
    const eslintConfig = eslintConfigRes.default;
    const alias = eslintConfig?.settings?.['import/resolver']?.alias?.map;
    if (Array.isArray(alias)) {
      alias.push([projectName, `./src/packages/${projectName}`]);
      eslintConfig.settings['import/resolver'].alias.map = alias;
      const eslintConfigText = `module.exports = ${JSON5.stringify(eslintConfig)}`;
      fse.writeFileSync(eslintConfigPath, eslintConfigText, 'utf-8');
      execSync(`npx prettier --write ${eslintConfigPath}`);
    }
  }
  // jsconfig配置文件夹引用alias
  const jsconfigPath = getAbsoluteFilePath('../jsconfig.json');
  try {
    const jsconfig = JSON5.parse(fse.readFileSync(jsconfigPath, 'utf-8'));
    jsconfig.compilerOptions.paths[projectName] = [`./src/packages/${projectName}`];
    fse.writeFileSync(jsconfigPath, JSON5.stringify(jsconfig), 'utf-8');
    execSync(`npx prettier --write ${jsconfigPath}`);
  } catch (error) {
    // do nothing
  }
}

/**
 * 创建项目
 * @param {string} projectName 项目名称
 * @param {bool} includeRouter 是否使用vue-router
 * @param {bool} includePinia 是否使用pinia
 * @returns
 */
function createProject(projectName, includeRouter, includePinia) {
  if (!projectName) {
    console.log('缺失项目名称');
    return;
  }
  // 项目目录
  const projectDir = getAbsoluteFilePath(`../src/packages/${projectName}`);

  if (!fse.existsSync(projectDir)) {
    runCreateProject(projectName, includeRouter, includePinia);
    return;
  }

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
        runCreateProject(projectName, includeRouter, includePinia);
      });
  } else {
    runCreateProject(projectName, includeRouter, includePinia);
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
    {
      type: 'confirm',
      name: 'router',
      when: ans => params[0] || ans.project.trim(),
      message: '是否使用vue-router？',
    },
    {
      type: 'confirm',
      name: 'pinia',
      when: ans => params[0] || ans.project.trim(),
      message: '是否使用pinia？',
    },
  ])
  .then((answers) => {
    createProject(params[0] || answers.project.trim(), answers.router, answers.pinia);
  })
  .catch((err) => {
    console.log(err);
  });
