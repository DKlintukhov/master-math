/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


#include <boost/test/unit_test.hpp>

#include "pch.h"

#include "Exercise.h"
#include "Utf8.h"

using namespace Core;

const std::string NAME = "Some mame with юникод";
const uint64_t ID = std::hash<std::string>{}(NAME);
const std::chrono::seconds TIMEOUT{ 5 };
const std::vector<std::string> PROBLEMS{ "2+2", "3+3", "задача" };
const std::vector<std::string> ANSWERS{ "4", "6", "ответ" };
const std::vector<std::string> SOLUTION{ "", "", "Решение" };


BOOST_AUTO_TEST_CASE(ExerciseToJsonTest)
{
    Exercise exercise(NAME, TIMEOUT, PROBLEMS, ANSWERS, SOLUTION);

    boost::json::object json = exercise.ToJson();

    BOOST_REQUIRE_EQUAL(json["id"].as_uint64(), ID);

    BOOST_CHECK_EQUAL(json["name"].as_string(), NAME);
    BOOST_CHECK_EQUAL(json["timeout"].as_int64(), TIMEOUT.count());

    boost::json::array problems = json["problems"].as_array();
    BOOST_REQUIRE_EQUAL(problems.size(), 3);

    BOOST_CHECK_EQUAL(problems[0].as_string(), PROBLEMS[0]);
    BOOST_CHECK_EQUAL(problems[1].as_string(), PROBLEMS[1]);
    BOOST_CHECK_EQUAL(problems[2].as_string(), PROBLEMS[2]);


    boost::json::array answers = json["answers"].as_array();
    BOOST_REQUIRE_EQUAL(answers.size(), 3);
    BOOST_CHECK_EQUAL(answers[0].as_string(), ANSWERS[0]);
    BOOST_CHECK_EQUAL(answers[1].as_string(), ANSWERS[1]);
    BOOST_CHECK_EQUAL(answers[2].as_string(), ANSWERS[2]);

    boost::json::array solution = json["solution"].as_array();
    BOOST_REQUIRE_EQUAL(solution.size(), 3);
    BOOST_CHECK_EQUAL(solution[0].as_string(), SOLUTION[0]);
    BOOST_CHECK_EQUAL(solution[1].as_string(), SOLUTION[1]);
    BOOST_CHECK_EQUAL(solution[2].as_string(), SOLUTION[2]);
}

BOOST_AUTO_TEST_CASE(ExerciseFromJsonTest)
{
    Exercise exercise(NAME, TIMEOUT, PROBLEMS, ANSWERS, SOLUTION);

    boost::json::object json = exercise.ToJson();

    Exercise exercise2(json);

    uint64_t id = exercise2.GetId();
    const auto& problems = exercise2.GetProblems();
    const auto& answers = exercise2.GetAnswers();
    const auto& solution = exercise2.GetSolution();
    const auto timeout = exercise2.GetTimeout();

    BOOST_CHECK_EQUAL(id, ID);
    BOOST_CHECK_EQUAL(timeout, TIMEOUT);
    BOOST_CHECK_EQUAL(problems.size(), PROBLEMS.size());
    BOOST_CHECK_EQUAL(answers.size(), ANSWERS.size());
    BOOST_CHECK_EQUAL(solution.size(), SOLUTION.size());

    for (size_t i = 0; i < problems.size(); ++i)
    {
        BOOST_CHECK_EQUAL(problems[i], PROBLEMS[i]);
    }

    for (size_t i = 0; i < answers.size(); ++i)
    {
        BOOST_CHECK_EQUAL(answers[i], ANSWERS[i]);
    }

    for (size_t i = 0; i < solution.size(); ++i)
    {
        BOOST_CHECK_EQUAL(solution[i], SOLUTION[i]);
    }
}
