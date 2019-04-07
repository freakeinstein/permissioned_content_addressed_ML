/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FastText extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const metric = {
            precision: 0,
            recall: 0,
            ipfs_id: 'none',
            docType: 'accuracy'
        };

        await ctx.stub.putState('METRIC', Buffer.from(JSON.stringify(metric)));
        console.info('Added <--> ', metric);
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryMetric(ctx) {
        console.info('============= START : Query Metric ===========');

        const metric = await ctx.stub.getState('METRIC'); 
        if (!metric || metric.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(metric.toString());
        return metric.toString();

        console.info('============= END : Query Metric ===========');
    }

    async createMetric(ctx, precision, recall, ipfs_id) {
        console.info('============= START : Create Metric ===========');

        const metric = {
            precision: precision,
            recall: recall,
            ipfs_id: ipfs_id,
            docType: 'accuracy'
        };

        await ctx.stub.putState('METRIC', Buffer.from(JSON.stringify(metric)));
        console.info('============= END : Create Metric ===========');
    }
}

module.exports = FastText;
