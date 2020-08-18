const utils = {};
(() => {
  function fillSelection(htmlNode, optionsToGet) {
    let optionsFunction;
    optionsToGet = optionsToGet.toLowerCase();
    if (!['timeslots', 'dates', 'days', 'hours'].includes(optionsToGet)) {
      throw new Error('Bad option specified!');
    }

    switch (optionsToGet) {
      case 'timeslots':
      case 'hours':
        optionsFunction = getTimeSlots;
        break;
      case 'dates':
      case 'days':
        optionsFunction = getDates;
        break;
    }

    optionsFunction().forEach((e) => {
      const timeSlot = document.createElement('option');
      timeSlot.innerText = e.text || e;
      timeSlot.value = e.value || e;
      htmlNode.append(timeSlot);
    });
  }

  function getTimeSlots() {
    const resultArray = [];
    const partsOfHour = 2;
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < partsOfHour; j++) {
        resultArray.push(`${i}:${j === 0 ? '00' : (60 / partsOfHour) * j}`);
      }
    }
    return resultArray;
  }

  function getDates(daysBack, daysForward) {
    const resultArray = [];
    daysBack = daysBack || 5;
    daysForward = daysForward || 31;
    for (let i = 0; i < daysBack; i++) {
      resultArray.push(
        moment()
          .subtract(daysBack - i, 'days')
          .format('YYYY-MM-DD')
      );
    }

    resultArray.push(moment().format('YYYY-MM-DD'));

    for (let i = 1; i < daysForward; i++) {
      resultArray.push(moment().add(i, 'days').format('YYYY-MM-DD'));
    }

    return resultArray;
  }

  function manageCompletion(event, id, todos, completed) {
    if (
      !event ||
      !todos ||
      !todos.length ||
      (!completed && completed !== false)
    )
      throw new Error('Bad params!');
    const idx = todos.findIndex((el) => el.id === id);
    if (idx > -1) todos[idx].completed = completed;
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  Object.assign(utils, { manageCompletion, fillSelection });
})();
