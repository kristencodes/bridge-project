const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const eventsData = require('../../../db/events.data.json');

const get = (req, res) => {
  res.status(200);
  return res.json({ data: eventsData });
};

const post = async (req, res) => {
  const id = new Date().getUTCMilliseconds().toString();
  const newEventsData = [...eventsData, { id, ...req.body }];
  await writeFile('db/events.data.json', JSON.stringify(newEventsData));
  res.status(201);

  return res.json({
    id,
    ...req.body
  });
};

const update = async (req, res) => {
  const id = req.params.id;
  const events = eventsData;
  const index = events.findIndex(event => event.id == id);

  if (index === -1) {
    return res.status(404).json({ errors: 'event id not found' });
  }
  const updatedEventsData = eventsData.map(event => {
    if (event.id == id) {
      return {
        ...event,
        ...req.body
      };
    }
    return event;
  });

  await writeFile('db/events.data.json', JSON.stringify(updatedEventsData));
  res.status(200);
  return res.json({
    updated: id
  });
};

const remove = async (req, res) => {
  const id = req.params.id;
  const updatedEventsData = eventsData;
  const index = updatedEventsData.findIndex(event => event.id == id);

  if (index === -1) {
    return res.status(404).json({ errors: 'event id not found' });
  }

  updatedEventsData.splice(index, 1);
  await writeFile('db/events.data.json', JSON.stringify(updatedEventsData));
  res.status(204);
  return res.json({
    deleted: id
  });
};

module.exports = {
  get,
  post,
  remove,
  update
};
