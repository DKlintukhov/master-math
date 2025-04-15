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
#include "Utf8.h"

namespace Core::EventHandlers
{
    void SaveExerciseHandler(webui::window::event* event) noexcept
    {
        try
        {
            const boost::json::value json = boost::json::parse(event->get_string(0));
            const boost::json::object& exerciseJson = json.at("exercise").as_object();

            const Exercise exercise(exerciseJson);

            if (!std::filesystem::exists(EXERCISES_DIR))
            {
                std::filesystem::create_directories(EXERCISES_DIR);
            }

            const std::string filename = exercise.GetName() + ".json";
            const std::filesystem::path path = EXERCISES_DIR / Encoding::ToWide(filename);

            boost::nowide::ofstream file(path);
            if (!file.is_open())
            {
                throw std::runtime_error("Failed to open file for reading: " + path.string());
            }

            file << boost::json::serialize(exercise.ToJson());

            if (!file.good())
            {
                throw std::runtime_error("Error writing to file: " + path.string());
            }

            event->return_string("{}");
        }
        catch (const std::exception& e)
        {
            boost::json::object errJson;
            errJson["error"] = e.what();
            std::string res = boost::json::serialize(errJson);
            event->return_string(res);
        }
    }
}
