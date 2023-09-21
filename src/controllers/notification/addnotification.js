const notification = require("../../models/notification");
const AWS = require("aws-sdk");
const addnotification = async (req, res) => {
  AWS.config.accessKeyId = "AKIA54TT3SNALHPPSH5W";
AWS.config.secretAccessKey = "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";
AWS.config.region = "ap-south-1";
  console.log("add notification called");
  const data = req.body.data || {};
  const newnotify = new notification({
    user: req.body.user,
    body: req.body.body,
    data,
  });
  if (!newnotify) {
    return res.json({ message: "Invalid data body", success: false });
  }
  try {
    const savednoti = await newnotify.save();
    AWS.config.update({region: 'ap-south-1'});

// Create publish parameters
var params = {
  Message: 'MESSAGE_TEXT', /* required */
  TopicArn: 'arn:aws:sns:ap-south-1:954799461184:endpoint/GCM/Connecting-nature/ad668294-0e7a-32c6-a63c-741df54727cb'
};

// Create promise and SNS service object
var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

// Handle promise's fulfilled/rejected states
publishTextPromise.then(
  function(data) {
    console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
    console.log("MessageID is " + data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
    return res.json({ success: true, savednoti });
  } catch (err) {
    console.log(err);
    return res.status({ success: false, message: "some error occured" });
  }
};

module.exports = addnotification;
