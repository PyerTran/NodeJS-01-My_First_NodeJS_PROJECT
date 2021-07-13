const users = require('./src/users.json')
const subs = require('./src/subscriptions.json')
const connections = require('./src/connections.json')
const milisec_to_hour_coef = 1000 * 60 * 60
const hour_to_day_coef = 24

function check_nb_connections(user_id)
{
    var dateobj = new Date()
    var year = dateobj.getFullYear()
    var month = dateobj.getMonth() + 1
    var day = dateobj.getDay()

    for (let i = 0; i < connections.length; i++) {
        const curr_log = connections[i];
        if (curr_log.user_id === user_id) {
            curr_log.connection.push(year + '-' + month + '-' + day)
            return curr_log.connection.length
        }
    }
    return 0
}

function elapsed_time(sub_date)
{
    var time_sub = new Date(sub_date).getTime()
    var time_now = Date.now()
    var elapsed_sub_now = (time_now - time_sub) / milisec_to_hour_coef / hour_to_day_coef

    return Math.round(elapsed_sub_now)
}

function user_is_sub(user_id, tmp_res, res)
{
    for (let i = 0; i < subs.length; i++) {
        const curr_sub = subs[i];
        if (curr_sub.user_id === user_id && curr_sub.status === "active") {
            tmp_res.msg = 'user active'
            if (elapsed_time(curr_sub.daySubscription) > 100)
                tmp_res.type = "old customer"
        } else if (curr_sub.user_id === user_id){
            tmp_res.msg = 'user no longer active'
            res.writeHead(200, tmp_res)
            res.end("not sub")
        }
    }
}

function post_handler(input_email, input_password, res) 
{
    var result = {};
    var users_id = undefined

    for (let i = 0; i < users.length; i++) {
        const curr_users = users[i];
        if (curr_users.email === input_email) {
            users_id = curr_users._id
            if (curr_users.password === input_password) {
                user_is_sub(curr_users._id, result)
                if (check_nb_connections(users_id) === 10)
                    result.congrats = "yeah"
                res.writeHead(200, result)
                res.end("you logged in as " + input_email)
            } else {
                result.error = "wrong password"
                res.writeHead(400, result)
                res.end("mauvais mot de passe D:")
            }
        }
    }
    console.log(result)
}

module.exports = {
    post_handler
}