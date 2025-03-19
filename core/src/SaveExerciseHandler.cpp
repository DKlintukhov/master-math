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

#include "pch.h"

#include "EventHandlers.h"
#include "Exercise.h"

namespace Core
{
    void SaveExerciseHandler(webui::window::event* event) noexcept
    {
        try
        {
            const boost::json::value json = boost::json::parse(event->get_string(0));

            const boost::json::object& exerciseJson = json.at("exercise").as_object();
            const boost::json::array& problemsJson = exerciseJson.at("problems").as_array();
            const boost::json::array& answersJson = exerciseJson.at("answers").as_array();
            const boost::json::array& solutionJson = exerciseJson.at("solution").as_array();
            const int64_t timeout = exerciseJson.at("timeout").as_int64();
            std::string name = exerciseJson.at("name").as_string().c_str();

            std::vector<std::string> problems;
            problems.reserve(problemsJson.size());
            std::vector<std::string> answers;
            answers.reserve(answersJson.size());
            std::vector<std::string> solution;
            answers.reserve(solutionJson.size());

            for (const auto& problemJson : problemsJson)
            {
                problems.push_back(problemJson.as_string().c_str());
            }

            for (const auto& answerJson : answersJson)
            {
                answers.push_back(answerJson.as_string().c_str());
            }

            for (const auto& solutionJson : solutionJson)
            {
                solution.push_back(solutionJson.as_string().c_str());
            }

            const Exercise exercise(
                std::move(name),
                std::chrono::seconds{ timeout },
                std::move(problems),
                std::move(answers),
                std::move(solution)
            );

            exercise.SaveAsCSV(EXERCISES_DIR);

            event->return_string("");
        }
        catch (const std::exception& e)
        {
            boost::json::object errJson;
            errJson["error"] = e.what();

            event->return_string(boost::json::serialize(errJson));
        }
    }
}
