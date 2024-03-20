import { FilterQuery, Model, UpdateQuery } from "mongoose";

export default class DB {
    constructor(){

    }

    public async GetDocuments<T>(model: Model<T>, query: FilterQuery<T>): Promise<T[]> {
        try {
            const documents: T[] = await model.find(query).exec();
            return documents;
        } catch (error) {
            throw new Error(`Error fetching documents: ${error}`);
        }
    }

    public async GetDocument<T>(model: Model<T>, query: FilterQuery<T>): Promise<T> {
        try {
            const document: T = await model.findOne(query).exec();
            return document;
        } catch (error) {
            throw new Error(`Error fetching documents: ${error}`);
        }
    }

    public async InsertDocument<T>(model: Model<T>, document: T): Promise<T> {
        try {
            const newDocument: T = await model.create(document);
            return newDocument;
        } catch (error) {
            throw new Error(`Error inserting document: ${error}`);
        }
    }
    
    public async UpdateDocument<T>(model: Model<T>, query: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
        try {
            const updatedDocument: T | null = await model.findOneAndUpdate(query, update, { new: true }).exec();
            return updatedDocument;
        } catch (error) {
            throw new Error(`Error updating document: ${error}`);
        }
    }

    public async DeleteDocument<T>(model: Model<T>, query: FilterQuery<T>): Promise<void> {
        try {
            const result = await model.deleteOne(query).exec();
            if (result.deletedCount === 0) {
                throw new Error('Document not found for deletion');
            }
        } catch (error) {
            throw new Error(`Error deleting document: ${error}`);
        }
    }
}