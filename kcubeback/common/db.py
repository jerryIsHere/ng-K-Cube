import sqlite3
from flask_restful import fields
import click
from flask import current_app, g
from flask.cli import with_appcontext

DATABASE_NAME = "kcube.db"


def get_db():
    db = sqlite3.connect(DATABASE_NAME, detect_types=sqlite3.PARSE_DECLTYPES)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = 1")
    return db


def where(json, resources):
    condition = [
        (key + " = " + str(json[key]))
        if resources[key] != fields.String
        else ("INSTR(" + key + ",'" + str(json[key]) + "') > 0")
        for key in json
        if key in resources
    ]
    if len(condition) < 1:
        return ""
    return " WHERE " + " AND ".join(condition)


def create_tables():
    tables = [
        """CREATE TABLE IF NOT EXISTS contributors(
                person_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            )
            """,
        """CREATE TABLE IF NOT EXISTS courses(
                course_id INTEGER PRIMARY KEY AUTOINCREMENT,
                entity_id INTEGER  NOT NULL UNIQUE,
                course_name TEXT NOT NULL,
                FOREIGN KEY(entity_id) REFERENCES entities(entity_id)
            )
            """,
        """CREATE TABLE IF NOT EXISTS graphs(
                graph_id INTEGER PRIMARY KEY AUTOINCREMENT,
                person_id INTEGER NOT NULL,
                course_id INTEGER NOT NULL,
                create_datetime DATETIME NOT NULL,
                last_update DATETIME NOT NULL,
                FOREIGN KEY(person_id) REFERENCES contributors(person_id),
                FOREIGN KEY(course_id) REFERENCES courses(course_id)
            )
            """,
        """CREATE TABLE IF NOT EXISTS triples(
                triple_id INTEGER PRIMARY KEY AUTOINCREMENT,
                graph_id INTEGER NOT NULL,
                head_entity TEXT NOT NULL,
                relationship TEXT NOT NULL,
                tail_entity TEXT NOT NULL,
                FOREIGN KEY(graph_id) REFERENCES graphs(graph_id),
                FOREIGN KEY(head_entity) REFERENCES entities(entity_id),
                FOREIGN KEY(tail_entity) REFERENCES entities(entity_id),
                FOREIGN KEY(relationship) REFERENCES relationships(relationship_id)
            )
            """,
        """CREATE TABLE IF NOT EXISTS entities(
                entity_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
            """,
        """CREATE TABLE IF NOT EXISTS relationships(
                relationship_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
            """,
        """CREATE TABLE IF NOT EXISTS schedules(
                schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
                graph_id INTEGER NOT NULL UNIQUE,
                create_datetime DATETIME NOT NULL,
                last_update DATETIME NOT NULL,
                FOREIGN KEY(graph_id) REFERENCES graphs(graph_id)
            )
            """,
        """CREATE TABLE IF NOT EXISTS teachings(
                teaching_id INTEGER PRIMARY KEY AUTOINCREMENT,
                schedule_id INTEGER NOT NULL,
                entity_id INTEGER NOT NULL,
                start INTEGER NOT NULL,
                duration INTEGER NOT NULL,
                FOREIGN KEY(schedule_id) REFERENCES schedules(schedule_id),
                FOREIGN KEY(entity_id) REFERENCES entities(entity_id)
            )
            """,
    ]
    db = get_db()
    cursor = db.cursor()
    for table in tables:
        cursor.execute(table)
