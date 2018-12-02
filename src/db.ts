
import sqlite3 from 'sqlite3';
import path from 'path';
import util from 'util';
import { config } from './config';
import { resolve } from 'url';

const FILENAME = path.resolve(__dirname, '..', `db-${Date.now()}`);

const db = new sqlite3.Database(
  FILENAME,
  sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error('Create/Open database fail.');
      console.error(err);
      process.exit(-1);
    }
    db.exec("CREATE TABLE comment (content TEXT, offset INT, createAt INT)")
    db.exec("CREATE TABLE player (id TEXT, name TEXT, createAt INT)")
    db.exec("CREATE TABLE vote (playerId TEXT, questionId INT, optionId INT, time INT, isAnswer INT)")
    db.exec("CREATE TABLE rank (rank INT, playerId TEXT, rate NUMBER, avgTime INT)")
    db.exec("CREATE TABLE question (id INT, content TEXT)")
    db.exec("CREATE TABLE option (id INT, questionId INT, content TEXT, isAnswer INT)")
  }
);

function insertComment(content: string, offsetTime: number, createAt: number) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT INTO comment VALUES (?, ?, ?)",
      [content, offsetTime, createAt]
    );
    stmt.run((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  })
}

function clearComment() {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM comment`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
}

interface IComment {
  content: string;
  offset: number;
  createAt: number
}
function listComment() {
  const dbAll = util.promisify<IComment[]>(
    db.all.bind(db, `SELECT content, offset, createAt FROM comment ORDER BY offset ASC`)
  );
  return dbAll();
}

function insertVote(playerId: string, questionId: number, optionId: number, time: number, isAnswer: boolean) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT INTO vote VALUES (?, ?, ?, ?, ?)",
      [playerId, questionId, optionId, time, isAnswer]
    );
    stmt.run((err) => err ? reject(err) : resolve());
  });
}

interface IVote {
  playerId: string;
  questionId: number;
  optionId: number;
  time: number;
  isAnswer: boolean;
}
function listVote() {
  const stmt = db.prepare("SELECT playerId, questionId, optionId, time, isAnswer");
  const list = util.promisify<IVote[]>(stmt.all);
  return list();
}

interface OpParams {
  questionId: number;
  id: number;
  content: string;
  isAnswer: boolean;
}

function insertQuestions(questions: typeof config.game.questions) {
  const insertQuestions = new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO question VALUES (?, ?)");
    for (let question of questions) {
      stmt.run(question.id, question.text);
    }
    stmt.finalize((err) => err ? reject(err) : resolve());
  });
  const insertOptions = new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO option VALUES (?, ?, ?, ?)");
    for (let question of questions) {
      for (let option of question.options) {
        const isAnswer = question.answer.id === option.id;
        stmt.run(option.id, question.id, option.text, isAnswer);
      }
    }
    stmt.finalize((err) => err ? reject(err) : resolve());
  });
  return Promise.all([insertQuestions, insertOptions]);
}

export {
  insertComment,
  clearComment,
  listComment,
  insertVote,
  insertQuestions,
  listVote
};

