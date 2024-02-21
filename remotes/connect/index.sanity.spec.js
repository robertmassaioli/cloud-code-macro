const request = require('supertest');
const app = require('./index');

describe('Integration test for Express app', () => {

  it('should return a descriptor JSON response for GET /atlassian-connect.json', async () => {
    const res = await request(app).get('/atlassian-connect.json');
    expect(res.status).toEqual(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body.key).toEqual("com.atlassian.connect.better-code-macro.local");
  });

  it('should return a page of bitbucket-snippet-code-macro containing requested snippet url', async () => {
    const res = await request(app).get('/macro/bitbucket-snippet-code-macro?snippetUrl=https://bitbucket.org/what-a-test');
    expect(res.status).toEqual(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('<meta name="snippet-url" content="https://bitbucket.org/what-a-test" />');
  });

});
