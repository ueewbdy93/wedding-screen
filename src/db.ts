
import path from 'path';
import sqlite3 from 'sqlite3';

import { config } from './config-helper';
import { IComment } from './core/comments/types';
import { IPlayer, PlayerVote } from './core/game/types';

const FILENAME = path.resolve(__dirname, '..', 'db', `db-wedding-screen.sqlite`);

const db = new sqlite3.Database(
  FILENAME,
  // tslint:disable-next-line:no-bitwise
  sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      // tslint:disable-next-line:no-console
      console.error('Create/Open database fail.');
      // tslint:disable-next-line:no-console
      console.error(err);
      process.exit(-1);
    }
  },
);

function init() {
  return new Promise<void>((resolve, reject) => {
    const sql = `
      BEGIN;
      CREATE TABLE IF NOT EXISTS comment (
        content TEXT, offset INT, createAt INT);
      CREATE TABLE IF NOT EXISTS player (
        id TEXT, name TEXT, score INT, rank INT,
        correctCount INT, incorrectCount INT, correctRate REAL, createAt INT);
      CREATE TABLE IF NOT EXISTS vote (
        playerId TEXT, questionId INT, optionId INT, time INT, isAnswer INT);
      CREATE TABLE IF NOT EXISTS question (id INT, content TEXT);
      CREATE TABLE IF NOT EXISTS option (
        id INT, questionId INT, content TEXT, isAnswer INT);
      COMMIT;
    `;
    db.exec(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function insertPlayers(players: ReadonlyArray<IPlayer>) {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(
      `INSERT INTO player (
        id, name, score, rank, correctCount,
        incorrectCount, correctRate, createAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    for (const player of players) {
      stmt.run(
        player.id, player.name, player.score, player.rank,
        player.correctCount, player.incorrectCount,
        player.correctRate, player.createAt,
      );
    }
    stmt.finalize((err) => err ? reject(err) : resolve());
  });
}

function clearPlayers() {
  return new Promise<void>((resolve, reject) => {
    db.run(`DELETE FROM player`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function updatePlayers(players: IPlayer[]) {
  await clearPlayers();
  await insertPlayers(players);
}

function insertComment(comment: IComment) {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO comment VALUES (?, ?, ?)',
      [comment.content, comment.offset, comment.createAt],
    );
    stmt.run((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function clearComment() {
  return new Promise<void>((resolve, reject) => {
    db.run(`DELETE FROM comment`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function insertQuestions(questions: typeof config.game.questions) {
  const insertQuestionsPromise = new Promise<void>((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO question VALUES (?, ?)');
    for (const question of questions) {
      stmt.run(question.id, question.text);
    }
    stmt.finalize((err) => err ? reject(err) : resolve());
  });
  const insertOptions = new Promise<void>((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO option VALUES (?, ?, ?, ?)');
    for (const question of questions) {
      for (const option of question.options) {
        const isAnswer = question.answers.indexOf(option.id) !== -1;
        stmt.run(option.id, question.id, option.text, isAnswer);
      }
    }
    stmt.finalize((err) => err ? reject(err) : resolve());
  });
  return Promise.all([insertQuestionsPromise, insertOptions]);
}

function insertPlayerVotes(votes: ReadonlyArray<PlayerVote>) {
  return new Promise<void>((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO vote VALUES (?, ?, ?, ?, ?)');
    for (const vote of votes) {
      stmt.run(
        vote.playerId, vote.questionId, vote.optionId,
        vote.time, (vote.isAnswer ? 1 : 0),
      );
    }
    stmt.finalize((err) => err ? reject(err) : resolve());
  });
}

function clearPlayerVotes() {
  return new Promise<void>((resolve, reject) => {
    db.run(`DELETE FROM vote`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export default {
  init,
  clearPlayers,
  insertPlayers,
  updatePlayers,
  insertComment,
  clearComment,
  insertQuestions,
  insertPlayerVotes,
  clearPlayerVotes,
};
