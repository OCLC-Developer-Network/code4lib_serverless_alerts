'use strict';

const aws = require('aws-sdk');
const fs = require('fs');
const yaml = require('js-yaml');

const s3 = new aws.S3();
const sns = new aws.SNS();

exports.handler = async (event, context) => {
	const account_id = JSON.stringify(context.invokedFunctionArn).split(':')[4];
	try {
		// Get the object from the event and show its content type
	    const bucket = event.Records[0].s3.bucket.name;
	    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
	    
	    // send an alert
	    try {
	        let sns_response = await sns.publish({
	            Message: key + 'published to S3 bucket named' + bucket,
	            //PhoneNumber:
	            TopicArn: "arn:" + process.env.AWS_REGION ":sns:" + account_id +  process.env.snsTopic;
	        console.log(sns_response.MessageId);
	        console.log("message successfully sent")
	    }catch (Error){
			console.log(Error, Error.stack);
		    return Error;		
	    }
	} catch (Error){
		console.log(Error, Error.stack);
	    return Error;
	}       
};