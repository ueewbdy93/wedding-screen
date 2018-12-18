
import path from 'path';
import sqlite3 from 'sqlite3';
import { config } from './config';
import { Comment } from './core/comments/types';
import { Player, PlayerVote } from './core/game/types';

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
    db.exec('CREATE TABLE comment (content TEXT, offset INT, createAt INT)');
    db.exec(`CREATE TABLE player (
              id TEXT, name TEXT, score INT, rank INT,
              correctCount INT, incorrectCount INT, correctRate REAL, createAt INT)`);
    db.exec(`CREATE TABLE vote (
              playerId TEXT, questionId INT, optionId INT, time INT, isAnswer INT)`);
    db.exec('CREATE TABLE rank (rank INT, playerId TEXT, rate NUMBER, avgTime INT)');
    db.exec('CREATE TABLE question (id INT, content TEXT)');
    db.exec('CREATE TABLE option (id INT, questionId INT, content TEXT, isAnswer INT)');
  },
);

function insertPlayers(players: ReadonlyArray<Player>) {
  return new Promise((resolve, reject) => {
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
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM player`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function updatePlayers(players: Player[]) {
  await clearPlayers();
  await insertPlayers(players);
}

function insertComment(comment: Comment) {
  return new Promise((resolve, reject) => {
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
  return new Promise((resolve, reject) => {
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
  const insertQuestions = new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO question VALUES (?, ?)');
    for (const question of questions) {
      stmt.run(question.id, question.text);
    }
    stmt.finalize((err) => err ? reject(err) : resolve());
  });
  const insertOptions = new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO option VALUES (?, ?, ?, ?)');
    for (const question of questions) {
      for (const option of question.options) {
        const isAnswer = question.answer.id === option.id;
        stmt.run(option.id, question.id, option.text, isAnswer);
      }
    }
    stmt.finalize((err) => err ? reject(err) : resolve());
  });
  return Promise.all([insertQuestions, insertOptions]);
}

function insertPlayerVotes(votes: ReadonlyArray<PlayerVote>) {
  return new Promise((resolve, reject) => {
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
  return new Promise((resolve, reject) => {
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
  clearPlayers,
  insertPlayers,
  updatePlayers,
  insertComment,
  clearComment,
  insertQuestions,
  insertPlayerVotes,
  clearPlayerVotes,
};

