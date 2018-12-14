'use strict';

const aws = require('aws-sdk');
const fs = require('fs');
const yaml = require('js-yaml');

const s3 = new aws.S3();
const sns = new aws.SNS();

const kms = new aws.KMS({'region': 'us-east-1'});
let environment = 'prod';
const params = {
  CiphertextBlob: fs.readFileSync(environment + "_config_encrypted.txt")
}

exports.handler = async (event) => {
	try {
		let data = await kms.decrypt(params).promise();
		
		let config = yaml.load(data['Plaintext'].toString());
		
		// Get the object from the event and show its content type
	    const bucket = event.Records[0].s3.bucket.name;
	    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
	    
	    // send an alert
	    try {
	        let sns_response = await sns.publish({
	            Message: key + 'published to S3 bucket named' + bucket,
	            //PhoneNumber:
	            TopicArn: config['topic_arn']}).promise();
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