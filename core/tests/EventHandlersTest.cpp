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
#include "EventHandlers.h"
#include "ExpressionGenerator.h"

using namespace Core;
using namespace boost::json;

BOOST_AUTO_TEST_CASE(GenerateExpressionsHandler)
{
    ExpressionGenerator::Config config;
    config.min = 1;
    config.max = 10;
    config.useAdd = true;
    config.useSub = true;
    config.useMul = true;
    config.useDiv = true;
    config.useFloats = true;
    size_t amount = 5;

    const EventHandlers::Expressions generatedExpressions = EventHandlers::GenerateExpressions(config, amount);

    BOOST_REQUIRE_EQUAL(generatedExpressions.size(), amount);

    object json = EventHandlers::ExpressionsToJson(generatedExpressions);

    BOOST_REQUIRE(json.contains("expressions"));
    BOOST_REQUIRE(json.contains("answers"));

    BOOST_REQUIRE(json["expressions"].is_array());
    BOOST_REQUIRE(json["answers"].is_array());

    const array expressions = json["expressions"].as_array();
    const array answers = json["answers"].as_array();

    BOOST_REQUIRE(expressions.size() == amount);
    BOOST_REQUIRE(answers.size() == amount);

    mu::Parser parser;
    std::stringstream ss;
    for (size_t i = 0; i < amount; ++i)
    {
        const std::string expr = expressions[i].as_string().c_str();
        parser.SetExpr(expr);
        ss << std::setprecision(3) << std::noshowpoint << parser.Eval();
        const std::string answer = ss.str();
        const std::string answer2 = answers[i].as_string().c_str();
        BOOST_CHECK_EQUAL(answer, answer2);
        ss.str("");
    }
}

BOOST_AUTO_TEST_CASE(GetAppInfoHandler)
{
    const EventHandlers::AppInfo appInfo = EventHandlers::GetAppInfo();

    BOOST_CHECK_EQUAL(appInfo.name, PACKAGE_NAME);
    BOOST_CHECK_EQUAL(appInfo.version, PACKAGE_VERSION);
    BOOST_CHECK_EQUAL(appInfo.homepage, PACKAGE_HOMEPAGE_URL);
    BOOST_CHECK_EQUAL(appInfo.bugreport, PACKAGE_BUGREPORT_URL);
    BOOST_CHECK_EQUAL(appInfo.releases, PACKAGE_RELEASES_URL);
    BOOST_CHECK_EQUAL(appInfo.debug, DEBUG);

    const boost::json::object json = EventHandlers::AppInfoToJson(appInfo);

    BOOST_REQUIRE(json.contains("appInfo"));

    const boost::json::object appInfoJson = json.at("appInfo").as_object();

    BOOST_REQUIRE(appInfoJson.contains("name"));
    BOOST_REQUIRE(appInfoJson.contains("version"));
    BOOST_REQUIRE(appInfoJson.contains("homepage"));
    BOOST_REQUIRE(appInfoJson.contains("bugreport"));
    BOOST_REQUIRE(appInfoJson.contains("releases"));
    BOOST_REQUIRE(appInfoJson.contains("debug"));

    BOOST_CHECK_EQUAL(appInfoJson.at("name").as_string(), appInfo.name);
    BOOST_CHECK_EQUAL(appInfoJson.at("version").as_string(), appInfo.version);
    BOOST_CHECK_EQUAL(appInfoJson.at("homepage").as_string(), appInfo.homepage);
    BOOST_CHECK_EQUAL(appInfoJson.at("bugreport").as_string(), appInfo.bugreport);
    BOOST_CHECK_EQUAL(appInfoJson.at("releases").as_string(), appInfo.releases);
    BOOST_CHECK_EQUAL(appInfoJson.at("debug").as_bool(), appInfo.debug);
}

BOOST_AUTO_TEST_CASE(SaveExerciseHandler)
{
    const std::string exerciseName = "TestExercise";
    const std::filesystem::path fullFilename = EventHandlers::EXERCISES_DIR / (exerciseName + EventHandlers::EXERCISE_FILE_EXT);
    const std::vector<std::string> problems{ "problem1", "problem2" };
    const std::vector<std::string> answers{ "answer1", "answer2" };
    const std::vector<std::string> solutions{ "solution1", "solution2" };
    const std::chrono::seconds seconds{ 60 };

    const Exercise exercise(exerciseName, seconds, problems, answers, solutions);

    BOOST_CHECK(EventHandlers::SaveExercise(exercise));
    BOOST_CHECK(std::filesystem::exists(fullFilename));

    const std::vector<Exercise> exercises = EventHandlers::LoadExercises();

    BOOST_REQUIRE(exercises.size() > 0);

    const auto found = std::find_if(
        std::cbegin(exercises),
        std::cend(exercises),
        [&](const Exercise& exercise)
        { return exercise.GetName() == exerciseName; }
    );

    BOOST_REQUIRE_EQUAL(found->GetProblems().size(), problems.size());
    BOOST_REQUIRE_EQUAL(found->GetAnswers().size(), answers.size());
    BOOST_REQUIRE_EQUAL(found->GetSolution().size(), solutions.size());

    for (size_t i = 0; i < problems.size(); ++i)
    {
        BOOST_CHECK(found->GetProblems()[i] == problems[i]);
    }

    for (size_t i = 0; i < problems.size(); ++i)
    {
        BOOST_CHECK(found->GetAnswers()[i] == answers[i]);
    }

    for (size_t i = 0; i < problems.size(); ++i)
    {
        BOOST_CHECK(found->GetSolution()[i] == solutions[i]);
    }

    BOOST_REQUIRE(found != std::cend(exercises));

    std::filesystem::remove_all(EventHandlers::EXERCISES_DIR);
}

BOOST_AUTO_TEST_CASE(DeleteExerciseHandler)
{
    BOOST_CHECK_THROW(EventHandlers::DeleteExercise(""), std::invalid_argument);

    const std::string exerciseName = "some file name";
    const std::string exerciseNameToDelete = "some file name, ютф-8";
    const std::string exerciseNameNotExists = "doesn't exist";

    const std::filesystem::path fullFilename = EventHandlers::EXERCISES_DIR / (exerciseName + EventHandlers::EXERCISE_FILE_EXT);
    const std::filesystem::path fullFilenameToDelete = EventHandlers::EXERCISES_DIR / (exerciseNameToDelete + EventHandlers::EXERCISE_FILE_EXT);
    const std::filesystem::path fullFilenameNotExists = EventHandlers::EXERCISES_DIR / (exerciseNameNotExists + EventHandlers::EXERCISE_FILE_EXT);

    const Exercise exercise(exerciseName, std::chrono::seconds{ 0 }, {}, {}, {});
    const Exercise exerciseToDelete(exerciseNameToDelete, std::chrono::seconds{ 0 }, {}, {}, {});
    const Exercise exerciseNotExists(exerciseNameNotExists, std::chrono::seconds{ 0 }, {}, {}, {});

    BOOST_CHECK(EventHandlers::SaveExercise(exercise));
    BOOST_CHECK(EventHandlers::SaveExercise(exerciseToDelete));

    BOOST_CHECK(EventHandlers::DeleteExercise(exerciseNameToDelete));
    BOOST_CHECK(!EventHandlers::DeleteExercise(exerciseNameNotExists));

    BOOST_CHECK(std::filesystem::exists(fullFilename));
    BOOST_CHECK(!std::filesystem::exists(fullFilenameToDelete));
    BOOST_CHECK(!std::filesystem::exists(fullFilenameNotExists));

    BOOST_REQUIRE(std::filesystem::remove_all(EventHandlers::EXERCISES_DIR));
}
