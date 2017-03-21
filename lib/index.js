'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const async = require('async');

// serverless.yaml resources配下を取得
function getResources(document) {
  if (_.has(document, 'resources')) {
    if (_.has(document.resources, 'Resources')) {
      return document.resources.Resources;
    }
  }
  throw new Error('resources not found.');
}
// テストのため
exports.getResources = getResources;

// TableName変換
function transportTableName(tableName) {
  const target = '$'.concat('{self:service}_').concat('$').concat('{self:provider.stage}_');
  return tableName.replace(target, '');
}

// テストのため
exports.transportTableName = transportTableName;

function main(src, dist) {
  // YAMLのロード
  const document = yaml.safeLoad(fs.readFileSync(src, 'utf8'));
  // resources配下を取得
  const resource = getResources(document);
  if (resource) {
    // tableごとに処理を行う
    const keys = Object.keys(resource);
    async.each(keys, (key, callback) => {
      // AWS::DynamoDB::Tableでない場合は処理を行わない
      if (_.has(resource[key], 'Type') && resource[key].Type === 'AWS::DynamoDB::Table') {
        // tableの定義作成
        const definition = { Table: resource[key].Properties };
        definition.Table.TableName = transportTableName(resource[key].Properties.TableName);
        // JSON Fileの書き出し
        fs.outputJson(`${dist}/${definition.Table.TableName}.json`, definition, callback);
      }
    });
  }
}
exports.main = main;
