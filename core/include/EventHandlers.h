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


#ifndef EVENT_HANDLERS_H
#define EVENT_HANDLERS_H

#include <filesystem>
#include <vector>
#include <string>
#include <webui.hpp>

#include "Exercise.h"
#include "ExpressionGenerator.h"

namespace Core::EventHandlers
{
    inline const std::filesystem::path EXERCISES_DIR = std::filesystem::current_path() / "exercises";

    boost::json::object GenerateExpressions(ExpressionGenerator::Config conf, size_t amount);
    boost::json::object GetAppInfo();
    bool SaveExercise(const Exercise& exercise);
    bool DeleteExercise(const std::string filename);

    void GenerateExpressionsHandler(webui::window::event* event);
    void SolveExpressionsHandler(webui::window::event* event);
    void SaveExerciseHandler(webui::window::event* event);
    void LoadExercisesHandler(webui::window::event* event);
    void DeleteExerciseHandler(webui::window::event* event);
    void GetAppInfoHandler(webui::window::event* event);
}

#endif
