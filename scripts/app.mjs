/* eslint-disable no-console */
/* eslint-disable import/extensions */
import inquirer from 'inquirer';
import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { EOL } from 'os';
import { getAbsoluteFilePath, getMode, getAllProjects, getEnvValues } from './util.mjs';

let projects = {};

const params = process.argv.slice(2);
const isBuild = params[0] === 'build';
const commandName = isBuild ? '打包' : '启动';

/**
 * 运行APP
 * @param {{project:string}}
 * project: 项目名称，也是目录名称
 */
function runApp({ project } = {}) {
  const projectConfig = projects[project];

  const mode = getMode(params, isBuild);

  // 写入env文件
  let envText = '';
  const envValues = getEnvValues(projectConfig, mode);
  const envs = {
    // 默认history路由
    VITE_ROUTE_MODE: 'history',
    ...envValues,
  };
  Object.keys(envs).forEach((key) => {
    envText += `${key}=${envs[key]}${EOL}`;
  });
  writeFileSync(getAbsoluteFilePath(`../.env.${mode}`), envText, 'utf8');

  // 运行时环境变量
  const runEnvValues = getEnvValues(projectConfig, mode, true);
  const runEnvs = {
    PROJECT_NAME: project,
    ...runEnvValues,
  };
  let envCmd = 'cross-env ';
  Object.keys(runEnvs).forEach((envKey) => {
    envCmd += `${envKey}=${runEnvs[envKey]} `;
  });

  console.log(`${commandName}项目：${projectConfig.name}`);

  const startRun = spawn(`npx ${envCmd} vite`, [...params], { stdio: 'inherit', shell: true });

  startRun.on('close', (code) => {
    console.log(`子进程退出，退出码 ${code}`);
  });
}

getAllProjects().then((res) => {
  projects = res;
  if (Object.keys(projects).length === 0) {
    console.log('暂无项目');
    process.exit();
  }

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'project',
        message: `请选择要${commandName}的项目`,
        choices: Object.keys(projects).map((item) => ({ name: projects[item].name || item, value: item })),
      },
    ])
    .then((answers) => {
      runApp(answers);
    })
    .catch((err) => {
      console.log(err);
    });
});
