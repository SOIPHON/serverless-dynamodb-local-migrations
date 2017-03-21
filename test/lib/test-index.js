'use strict';

const chai = require('chai');
const sdlm = require('../../lib');
const fs = require('fs-extra');

const expect = chai.expect;

const testJson = `${__dirname}/../../migrations/test.json`;

describe('UNIT TEST: ./../lib/index.js', () => {
  before((done) => {
    fs.unlink(testJson, () => {
      done();
    });
  });

  after((done) => {
    fs.unlink(testJson, () => {
      done();
    });
  });

  it('ymlにresourcesプロパティを持っていない場合は、例外をスローする', () => {
    expect(() => {
      sdlm.main(`${__dirname}/test2.yml`, './migrations');
    }).to.throw(/resources not found./);
  });

  it('ymlにresources.Resourcesプロパティを持っていない場合は、例外をスローする', () => {
    expect(() => {
      sdlm.main(`${__dirname}/test3.yml`, './migrations');
    }).to.throw(/resources not found./);
  });

  it('TestTableのリソース定義がJson出力されること', () => {
    sdlm.main(`${__dirname}/test1.yml`, './migrations');
    const packageObj = fs.readJson(testJson, () => {
      expect(packageObj).to.deep.equal({
        Table: {
          TableName: 'test',
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'kishu_id',
              KeyType: 'RANGE',
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'kishu_id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'search_key',
              AttributeType: 'S',
            },
            {
              AttributeName: 'partition_id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'type_id',
              AttributeType: 'N',
            },
            {
              AttributeName: 'brand_id',
              AttributeType: 'N',
            },
            {
              AttributeName: 'nohinkaishibi',
              AttributeType: 'S',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          LocalSecondaryIndexes: [
            {
              IndexName: 'id-type_id-index',
              KeySchema: [
                {
                  AttributeName: 'id',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'type_id',
                  KeyType: 'RANGE',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
            {
              IndexName: 'id-brand_id-index',
              KeySchema: [
                {
                  AttributeName: 'id',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'brand_id',
                  KeyType: 'RANGE',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
            {
              IndexName: 'id-nohinkaishibi-index',
              KeySchema: [
                {
                  AttributeName: 'id',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'nohinkaishibi',
                  KeyType: 'RANGE',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: 'search_key-partition_id-index',
              KeySchema: [
                {
                  AttributeName: 'search_key',
                  KeyType: 'HASH',
                },
                {
                  AttributeName: 'partition_id',
                  KeyType: 'RANGE',
                },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
              },
            },
          ],
        },
      });
    });
  });
});
