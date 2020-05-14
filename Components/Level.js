export class Level {
  constructor (type, subtype, createLevel, successCriteria, onSuccess, onHint, createUI) {
    this.type = type
    this.subtype = subtype
    this.createLevel = createLevel
    this.successCriteria = successCriteria
    this.completed = false
    this.onSuccess = onSuccess
    this.onHint = onHint
    this.createUI = createUI ? createUI : () => {}
  }

  async create (updateUI = true) {
    window.albot.currentMood = "default"
    if (updateUI) await this.createUI()
    await this.createLevel()
  }

  isComplete (n) {
    const isSuccess = this.successCriteria(n)
    if (isSuccess) { this.completed = true }
    return isSuccess
  }
}
