/**
 * @description json schema校验
 */

const Ajv = require('ajv')
const ajv = new Ajv({
    //  allErrors: true // 输出所有的错误（慢）
})

/**
 * json schema校验
 * @param {Object} schema json schema规则
 * @param {Object} data 代校验数据
 */
function validate(schema, data = {}) {
    const valid = ajv.validate(schema, data)

    if (!valid) {
        return ajv.errors[0]
    }
}

module.exports = validate