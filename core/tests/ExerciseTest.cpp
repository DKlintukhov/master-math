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
const std::chrono::seconds TIMEOUT{ 5 };
const std::vector<std::string> PROBLEMS{ "2+2", "3+3", "задача" };
const std::vector<std::string> ANSWERS{ "4", "6", "ответ" };

BOOST_AUTO_TEST_CASE(ExerciseTest)
{
    std::locale::global(std::locale(""));

    const std::filesystem::path dirPath = std::filesystem::current_path();
    const std::filesystem::path fullFilename = dirPath / Encoding::ToWide("Some mame with юникод.csv");

    {
        Exercise exercise(NAME, TIMEOUT, PROBLEMS, ANSWERS);
        exercise.SaveAsCSV(dirPath);

        BOOST_REQUIRE(std::filesystem::exists(fullFilename));
    }

    {
        Exercise exercise(fullFilename);

        const auto& problems = exercise.GetProblems();
        const auto& answers = exercise.GetAnswers();
        const auto timeout = exercise.GetTimeout();

        BOOST_CHECK_EQUAL(timeout, TIMEOUT);
        BOOST_CHECK_EQUAL(problems.size(), PROBLEMS.size());
        BOOST_CHECK_EQUAL(answers.size(), ANSWERS.size());

        for (size_t i = 0; i < problems.size(); ++i)
        {
            BOOST_CHECK_EQUAL(problems[i], PROBLEMS[i]);
        }

        for (size_t i = 0; i < answers.size(); ++i)
        {
            BOOST_CHECK_EQUAL(answers[i], ANSWERS[i]);
        }
    }

    BOOST_REQUIRE(std::filesystem::remove(fullFilename));
}

BOOST_AUTO_TEST_CASE(ExerciseToHsonTest)
{
    Exercise exercise("Test Exercise", std::chrono::seconds(30), { "Problem A", "Problem B" }, { "Answer X", "Answer Y" });

    boost::json::object json_obj = exercise.ToJson();

    BOOST_CHECK_EQUAL(json_obj["name"].as_string(), "Test Exercise");
    BOOST_CHECK_EQUAL(json_obj["timeout"].as_int64(), 30);

    boost::json::array problems = json_obj["problems"].as_array();
    BOOST_REQUIRE_EQUAL(problems.size(), 2);

    BOOST_CHECK_EQUAL(problems[0].as_string(), "Problem A");
    BOOST_CHECK_EQUAL(problems[1].as_string(), "Problem B");


    boost::json::array answers = json_obj["answers"].as_array();
    BOOST_REQUIRE_EQUAL(answers.size(), 2);
    BOOST_CHECK_EQUAL(answers[0].as_string(), "Answer X");
    BOOST_CHECK_EQUAL(answers[1].as_string(), "Answer Y");
}