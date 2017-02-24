'use strict';

// YAML JSON を相互に変換するnpm
const yaml = require('js-yaml');
// file system
const fs = require('fs');
const _ = require('lodash');

// serverless.yaml resources配下を取得
function getResources(document) {
  if (_.has(document, 'resources')) {
    if (_.has(document.resources, 'Resources')) {
      return document.resources.Resources;
    }
  }
  return null;
}

// TableName変換
function transportTableName(tableName) {
  return tableName.replace('${self:service}_${self:provider.stage}_', '');
}

try {
  // YAMLのロード
  const document = yaml.safeLoad(fs.readFileSync('./serverless.yml', 'utf8'));
  // resources配下を取得
  const resource = getResources(document);
  if (resource) {
    // tableごとに処理を行う
    let definition;
    Object.keys(resource).forEach((key) => {
      // Tableでない場合は処理を行わない
      if (_.has(resource[key], 'Type')) {
        // tableの定義作成
        definition = { Table: resource[key].Properties };
        definition.Table.TableName = transportTableName(resource[key].Properties.TableName);
        // JSON Fileの書き出し
        fs.writeFile(`${definition.Table.TableName}.json`, JSON.stringify(definition, null, '\t'));
      }
    });
  }
} catch (e) {
  console.error(e);
}
