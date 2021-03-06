const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    // const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('board')
        // var boards = await collection.find(criteria).toArray()
        var boards = await collection.find().toArray()
        boards = boards.map(board => {
            board.createdAt = ObjectId(board._id).getTimestamp()
            return board
        })
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}


async function remove(boardId) {
    try {
        // const store = asyncLocalStorage.getStore()
        // const { userId, isAdmin } = store
        const collection = await dbService.getCollection('board')
        // remove only if user is owner/admin

        const query = { _id: ObjectId(boardId) }
        // if (!isAdmin) query.byUserId = ObjectId(userId)
        await collection.deleteOne(query)
        // return await collection.deleteOne({ _id: ObjectId(boardId), byUserId: ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}


async function add(board) {
    try {
        // peek only updatable fields!
        // board.createdBy._id = ObjectId(board)
        console.log('board', board)
        // let boardToAdd = board
        // boardToAdd = {
        //     createdBy: ObjectId(board.createdBy),
        //     // aboutUserId: ObjectId(board.aboutUserId),
        //     // txt: board.txt
        // }
        console.log('board created')
        const collection = await dbService.getCollection('board')
        await collection.insertOne(board)
        return board;
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function updateBoard(board) {
    const collection = await dbService.getCollection('board');
    const id = new ObjectId(board._id);
    board._id = id;
    try {
        await collection.updateOne({ _id: ObjectId(board._id) }, { $set: board });
        return board;
    } catch (err) {
        console.log(`ERROR: cannot update toy ${board._id}`);
        throw err;
    }
}

async function getById(boardId) {
    const collection = await dbService.getCollection('board');
    try {
        const board = await collection.findOne({ '_id': ObjectId(boardId) });
        return board;
    } catch (err) {
        console.log(`ERROR: cannot find board ${boardId}`);
        throw err;
    }
}


function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.name) {
        criteria.name = { $regex: filterBy.name, $options: 'i' }
    }
    if (filterBy.type) {
        criteria.type = filterBy.type
    }
    if (filterBy.inStock) {
        criteria.inStock = inStock
    }
    if (filterBy.price) {
        criteria.price = { $gte: filterBy.price }
    }
    return criteria
}

module.exports = {
    query,
    remove,
    add,
    updateBoard,
    getById
}


