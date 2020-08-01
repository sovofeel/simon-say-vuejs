export const sleep = duration => new Promise(resolve => setTimeout(resolve, duration));

export const asyncRemoveActiveClass = (nodeList, index) => new Promise(resolve => {
  nodeList[index].classList.remove('active')
  resolve()
});

export const asyncAddActiveClass = (nodeList, index) => new Promise(resolve => {
  nodeList[index].classList.add('active')
  resolve()
});